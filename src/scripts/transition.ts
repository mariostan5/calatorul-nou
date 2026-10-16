/* The cloud between pages. Astro lets us wrap the page loader, so the cloud covers the screen
   before the new page is swapped in; once it has loaded, the cloud carries on and uncovers it. */
import { gsap, reducedMotion } from './motion';

export function initCloudPass(el: HTMLElement) {
  let covering: Promise<unknown> = Promise.resolve();
  let active = false; // a navigation is under way: the cloud is (or is going) over the page

  document.addEventListener('astro:before-preparation', (ev) => {
    const rm = reducedMotion();
    active = true;
    gsap.killTweensOf(el);
    covering = rm
      ? gsap.fromTo(el, { autoAlpha: 0, yPercent: 0 }, { autoAlpha: 1, duration: 0.2 }).then()
      : gsap.fromTo(el, { autoAlpha: 1, yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' }).then();
    const load = ev.loader;
    // never wait on the cloud for long: in a background tab animation frames stop and it would hang
    const capped = Promise.race([covering, new Promise((r) => setTimeout(r, 700))]);
    ev.loader = async () => { await Promise.all([capped, load()]); };
  });

  document.addEventListener('astro:page-load', () => {
    if (!active) return; // first load: nothing to uncover
    active = false;
    reducedMotion()
      ? gsap.to(el, { autoAlpha: 0, duration: 0.2 })
      : gsap.to(el, { yPercent: -110, duration: 0.8, ease: 'power3.inOut', onComplete: () => gsap.set(el, { autoAlpha: 0, yPercent: 110 }) });
  });
}

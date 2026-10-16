/* Through the porthole: the hero is held in place, the words lift away, the cabin wall grows around
   the centre of its glass until the glass is wider and taller than the screen, the clouds outside
   settle from 118% to 100%, and the next section rides up over them as a rounded panel. */
import { gsap, SplitText, reducedMotion, lenis, $, $$ } from './motion';

// the glass inside cabin-wall.webp, as a share of the image (2208 × 920)
const GLASS_W = 340 / 2208, GLASS_H = 530 / 920;

/** The intro (only when Hero's inline script un-hid it): the logo arrives, a yellow ring draws itself
    round it, the dark opens like an iris onto the porthole, the name writes itself out letter by
    letter, then the menu comes in. Scrolling waits until it is over (~3.6s). */
export function playIntro(root: HTMLElement): () => void {
  const intro = $('.intro', root)!;
  if (intro.hidden) return () => {};
  const mark = $('.intro-mark', root)!, logo = $('img', mark)!, rings = $$('circle', mark), nav = $('[data-nav]');
  const split = SplitText.create($$('.hl-line', root), { type: 'chars', mask: 'chars' });
  const done = () => {
    try { sessionStorage.setItem('ca-intro', '1'); } catch {}
    document.documentElement.classList.remove('intro-playing');
    intro.hidden = true;
    lenis?.start();
  };
  lenis?.stop();
  const tl = gsap.timeline({ onComplete: done })
    .from(logo, { scale: 0.6, autoAlpha: 0, filter: 'blur(12px)', duration: 1.1, ease: 'expo.out' }, 0.1)
    .to(rings, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.15 }, 0.25)
    .to(mark, { scale: 1.06, duration: 0.5, ease: 'power2.out' }, 1.35)
    .to(mark, { y: -30, autoAlpha: 0, scale: 0.9, duration: 0.6, ease: 'power3.in' }, 1.75)
    .to(intro, { '--r': () => `${Math.hypot(innerWidth, innerHeight) / 2 + 40}px`, duration: 1.1, ease: 'power3.inOut' }, 2.0)
    .call(() => document.documentElement.classList.remove('intro-playing'), [], 2.3)
    .from(split.chars, { yPercent: 110, autoAlpha: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out', stagger: 0.035 }, 2.3)
    .from(nav, { autoAlpha: 0, y: -16, duration: 0.8, ease: 'expo.out' }, 3.0);
  return () => {
    tl.kill();
    split.revert();
    gsap.set([logo, mark, intro, nav], { clearProps: 'all' });
    if (!intro.hidden) done();
  };
}

export function initHero(root: HTMLElement): () => void {
  if (reducedMotion()) return () => {};
  const copy = $('.hero-copy', root)!, cue = $('.hero-cue', root)!, wall = $('.hero-wall img', root)!, sky = $('.hero-sky', root)!;

  // offset* are layout sizes, untouched by our transforms, so this is right after every resize
  const through = () => Math.max(root.clientWidth / (wall.offsetWidth * GLASS_W), root.clientHeight / (wall.offsetHeight * GLASS_H)) * 1.15;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root, start: 'top top', end: '+=120%', pin: true, scrub: 1, invalidateOnRefresh: true },
  });
  tl.to([copy, cue], { y: -60, autoAlpha: 0, duration: 0.2 }, 0)
    .to(wall, { scale: through, ease: 'power2.in', duration: 0.7 }, 0.05)
    .to(sky, { scale: 1, ease: 'power1.out', duration: 1 }, 0);

  return () => { tl.scrollTrigger?.kill(); tl.kill(); gsap.set([copy, cue, wall, sky], { clearProps: 'all' }); };
}

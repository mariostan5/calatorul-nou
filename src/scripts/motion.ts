/* Shared motion: Lenis smooth scroll on GSAP's clock, the reveals every page uses, and `onPage`, which
   runs a page's setup after every navigation (ClientRouter) and undoes it before the next swap. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

export const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
export const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];
/** True when the visitor asked for reduced motion: only fades. */
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fmt = (v: number) => Math.round(v).toLocaleString('ro-RO');

export let lenis: Lenis | null = null;

type Cleanup = () => void;
const cleanups: Cleanup[] = [];
/** Run `fn` on every page load (first load and each navigation); its returned cleanup runs before the next swap. */
export function onPage(fn: () => Cleanup | void) {
  document.addEventListener('astro:page-load', () => {
    const c = fn();
    if (c) cleanups.push(c);
  });
}

const fadeIn = (el: Element) => gsap.from(el, { opacity: 0, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });

/** [data-split] titles rise line by line, [data-reveal] blocks rise, [data-img] images open from a mask, [data-count] numbers count up. */
function reveals(): Cleanup {
  const rm = reducedMotion();
  const splits: SplitText[] = [];
  $$('[data-split]').forEach((el) => {
    if (rm) return fadeIn(el);
    splits.push(SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.25, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
    }));
  });
  $$('[data-reveal]').forEach((el) => {
    if (rm) return fadeIn(el);
    gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  $$('[data-img]').forEach((el) => {
    if (rm) return fadeIn(el);
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      .fromTo(el, { clipPath: 'inset(14% 10% 14% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out' })
      .from($('img', el), { scale: 1.15, duration: 1.6, ease: 'expo.out' }, 0);
  });
  $$('[data-count]').forEach((el) => {
    if (rm) return;
    const to = +el.dataset.count!, suf = el.dataset.suffix || '', o = { v: 0 };
    el.textContent = fmt(0) + suf;
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(o.v) + suf) }) });
  });
  return () => splits.forEach((s) => s.revert());
}

/** Once per visit: smooth scroll, page lifecycle, reveals on every page. */
export function initMotion() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!reducedMotion()) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('astro:before-swap', () => {
    cleanups.splice(0).forEach((c) => c());
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });
  document.addEventListener('astro:after-swap', () => {
    lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0);
  });
  onPage(reveals);
}

export { gsap, ScrollTrigger, SplitText };

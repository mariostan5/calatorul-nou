/* A row that drifts left forever (the track holds its cards twice, so moving it by half is seamless),
   easing to a stop while the pointer is over it and easing back into motion when it leaves. */
import { gsap, reducedMotion } from './motion';

const SPEED = 40; // px per second

export function initMarquee(track: HTMLElement): () => void {
  if (reducedMotion()) return () => {};
  const loop = gsap.to(track, { xPercent: -50, ease: 'none', repeat: -1, duration: track.scrollWidth / 2 / SPEED });
  const to = (timeScale: number) => gsap.to(loop, { timeScale, duration: 0.6, ease: 'power2.out', overwrite: true });
  const stop = () => to(0), go = () => to(1);
  track.addEventListener('pointerenter', stop);
  track.addEventListener('pointerleave', go);
  track.addEventListener('focusin', stop);
  track.addEventListener('focusout', go);
  return () => { loop.kill(); gsap.set(track, { clearProps: 'transform' }); };
}

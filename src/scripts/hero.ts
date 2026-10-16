/* Scrolling through the porthole: the hero is held in place, the words lift away, the porthole grows
   (around the centre of its glass) until the glass is wider and taller than the screen, then a soft
   veil of cloud carries you into the next section. */
import { gsap, reducedMotion, $ } from './motion';

// the glass inside hublou-frame.webp, as a share of the image (960 × 1200)
const GLASS_W = 484 / 960, GLASS_H = 648 / 1200, GLASS_CY = 601 / 1200;

export function initHero(root: HTMLElement): () => void {
  if (reducedMotion()) return () => {};
  const copy = $('.hero-copy', root)!, port = $('.hero-port', root)!, veil = $('.hero-veil', root)!;

  // the glass in layout pixels (offset* ignore transforms, so this holds after every resize)
  const glass = () => ({ w: port.offsetWidth * GLASS_W, h: port.offsetHeight * GLASS_H, cy: port.offsetTop + port.offsetHeight * GLASS_CY });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root, start: 'top top', end: '+=150%', pin: true, scrub: 1, invalidateOnRefresh: true },
  });
  tl.to(copy, { y: -80, autoAlpha: 0, duration: 0.3 }, 0)
    .to(port, {
      scale: () => { const g = glass(); return Math.max(root.clientWidth / g.w, root.clientHeight / g.h) * 1.15; },
      y: () => root.clientHeight / 2 - glass().cy,
      ease: 'power2.in',
      duration: 0.7,
    }, 0.15)
    .to(veil, { opacity: 1, duration: 0.25 }, 0.75); // ends in the page colour, so the next section rises out of the cloud

  return () => { tl.scrollTrigger?.kill(); tl.kill(); gsap.set([copy, port, veil], { clearProps: 'all' }); };
}


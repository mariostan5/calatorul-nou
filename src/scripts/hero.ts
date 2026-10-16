/* Through the porthole: the hero is held in place, the words lift away, the cabin wall grows around
   the centre of its glass until the glass is wider and taller than the screen, the clouds outside
   settle from 118% to 100%, and a soft veil of cloud carries you into the next section. */
import { gsap, reducedMotion, $ } from './motion';

// the glass inside cabin-wall.webp, as a share of the image (2208 × 920)
const GLASS_W = 340 / 2208, GLASS_H = 530 / 920;

export function initHero(root: HTMLElement): () => void {
  if (reducedMotion()) return () => {};
  const copy = $('.hero-copy', root)!, cue = $('.hero-cue', root)!, wall = $('.hero-wall img', root)!, sky = $('.hero-sky', root)!, veil = $('.hero-veil', root)!;

  // offset* are layout sizes, untouched by our transforms, so this is right after every resize
  const through = () => Math.max(root.clientWidth / (wall.offsetWidth * GLASS_W), root.clientHeight / (wall.offsetHeight * GLASS_H)) * 1.15;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root, start: 'top top', end: '+=160%', pin: true, scrub: 1, invalidateOnRefresh: true },
  });
  tl.to([copy, cue], { y: -60, autoAlpha: 0, duration: 0.25 }, 0)
    .to(wall, { scale: through, ease: 'power2.in', duration: 0.75 }, 0.1)
    .to(sky, { scale: 1, ease: 'power1.out', duration: 0.85 }, 0.1)
    .to(veil, { opacity: 1, duration: 0.2 }, 0.8); // ends in the page colour, so the next section rises out of the cloud

  return () => { tl.scrollTrigger?.kill(); tl.kill(); gsap.set([copy, cue, wall, sky, veil], { clearProps: 'all' }); };
}

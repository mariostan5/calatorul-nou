/* A row of cards you drag sideways (mouse or finger), with inertia, as on travelnextlvl.de.
   A drag never opens a card; a short click does. */
import { gsap } from './motion';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

export function initDragCarousel(track: HTMLElement): () => void {
  const viewport = track.parentElement!;
  let moved = false;
  const [drag] = Draggable.create(track, {
    type: 'x',
    inertia: true,
    edgeResistance: 0.85,
    dragClickables: true,
    minimumMovement: 6,
    bounds: { minX: 0, maxX: 0 },
    onPress() { moved = false; },
    onDragStart() { moved = true; },
  });
  // the track may be wider or narrower than the screen: recompute how far it can go
  const fit = () => {
    const min = Math.min(0, viewport.clientWidth - track.scrollWidth);
    drag.applyBounds({ minX: min, maxX: 0 });
  };
  fit();
  addEventListener('resize', fit);
  // a drag that ends over a card must not follow its link
  const stop = (e: Event) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };
  track.addEventListener('click', stop, true);
  return () => { removeEventListener('resize', fit); drag.kill(); };
}

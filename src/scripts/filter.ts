/* Buttons [data-filter="Asia"] show only the cards [data-tags~="Asia"]; [data-filter=""] shows all. */
import { $$ } from './motion';

export function initFilter(root: HTMLElement): () => void {
  const buttons = $$<HTMLButtonElement>('[data-filter]', root), cards = $$('[data-tags]', root);
  const pick = (e: Event) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-filter]');
    if (!b) return;
    const f = b.dataset.filter!;
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    cards.forEach((c) => (c.hidden = !!f && !c.dataset.tags!.split('|').includes(f)));
  };
  root.addEventListener('click', pick);
  return () => root.removeEventListener('click', pick);
}

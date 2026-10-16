/** The club's own trip photos (from the Travorium folder): pNN.webp full size, pNN-s.webp for cards. */
export const photos = Array.from({ length: 54 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { src: `/photos/p${n}.webp`, thumb: `/photos/p${n}-s.webp` };
});

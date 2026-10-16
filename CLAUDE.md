# Proiect
Fațada publică „Călătorul Antreprenor” (site separat de `../site`), care duce spre platforma de membri https://calatorulantreprenor.com/club. Limba: română.
Spec: `docs/superpowers/specs/2026-10-16-fatada-hibrid-design.md` · Plan: `docs/superpowers/plans/2026-10-16-fatada-hibrid.md`.

# Reguli
- Tot conținutul CENTRAT. Atmosferă „cer deschis” (cer de zi, nori); galben #FACC15 doar pe butoane/accente, albastru #115089 pentru linii. Titluri Oswald, text Inter, un cuvânt-cheie per titlu în `<em>` (Instrument Serif italic), cu punctuația înăuntru.
- Ton: fără „bani ușori”, „venit pasiv garantat”, „renunță la job”; fără sume pe destinații („prețuri de membru”); sume doar cu „ilustrativ”; nota despre venituri pe Academie și Răscruce.
- Mișcare: GSAP + Lenis (`src/scripts/motion.ts`); setup-ul fiecărei pagini prin `onPage()` (navigare cu ClientRouter), cu cleanup. Reduced motion = doar fade-uri.
- Linkurile spre platformă doar din `src/config.ts`.
- Teste: `npm run build && npm test`; `npm run check`. Dev: launch config „hibrid” (port 4330).
- Desktop întâi (1440px). Push/deploy doar când cere utilizatorul.

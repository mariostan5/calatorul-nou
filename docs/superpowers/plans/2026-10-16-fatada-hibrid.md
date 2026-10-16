# Fațada hibrid — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un site Astro public, separat, care e fațada platformei calatorulantreprenor.com/club: hero cu hublou prin care treci la scroll, apoi călătorii → comunitate → răscruce → calendar, plus 6 pagini interioare.

**Architecture:** Astro static (fără framework UI). Un modul comun de mișcare (Lenis + GSAP) inițializat la fiecare `astro:page-load` (navigare cu `ClientRouter`), câte un script mic per componentă cu animație. Conținut în content collections JSON + `src/config.ts`; singura logică netrivială (recurența evenimentelor și ora locală) stă în `src/lib/events.ts`, testată cu `node --test`.

**Tech Stack:** Astro 5+, GSAP 3.13+ (ScrollTrigger, SplitText, Draggable, InertiaPlugin), Lenis, Google Fonts (Oswald, Inter, Instrument Serif italic), ffmpeg pentru media, `node:test` + `tsx` pentru teste.

**Spec:** `docs/superpowers/specs/2026-10-16-fatada-hibrid-design.md`

## Global Constraints

- Tot textul în română. Tot conținutul centrat (titluri, texte, butoane, carduri).
- Brand: `#FACC15` butoane (text negru), `#115089` linii/accente mici, fundal `#FAFAF9`, carduri `#FFFFFF` cu bordură `#E7E5E4`, raze 6px butoane / 12px carduri. Titluri Oswald 600–700, text Inter, un cuvânt-cheie per titlu în `<em>` Instrument Serif italic, cu punctuația în `<em>`.
- Atmosfera „cer deschis”: cer albastru de zi, nori; galbenul doar pe butoane și accente.
- Ton: fără „bani ușori”, „venit pasiv garantat”, „renunță la job”; fără sume pe destinații („prețuri de membru”); sume doar cu eticheta „ilustrativ”; nota despre venituri pe Academie și pe Răscruce.
- Mișcare: expo.out la apariții (1.1–1.4s), power3.inOut la tranziții (0.8s), fără bounce/elastic; titluri pe rânduri din mască la 0.08s; imagini 115% → 100%; cifre de la 0 în 1.6s cu tabular-nums. `prefers-reduced-motion`: doar fade-uri, fără pin. Text lizibil fără JS.
- Performanță: LCP < 2.5s pe 4G, JS inițial < 150 KB, imagini AVIF/WebP, video cer < 2 MB.
- Toate linkurile spre platformă pornesc din `PLATFORM = 'https://calatorulantreprenor.com'`.
- Desktop întâi (1440px); mobilul (375px) mai târziu, la cerere.
- Fără push pe GitHub / publicare pe Vercel până nu cere utilizatorul.

## Review Focus

1. **Navigare între pagini cu `ClientRouter`**: după a doua pagină animațiile trebuie să pornească din nou și ScrollTrigger-ele vechi să fie omorâte (altfel pin-uri fantomă, scroll blocat). → Task 7 test.
2. **Ora evenimentelor**: platforma afișează „în ora ta locală”; un membru din Londra vede Zoom-ul de joi 19:00 (București) la 17:00. Evenimentele trecute nu apar; cel săptămânal arată următoarea apariție și rămâne la 19:00 București după trecerea la ora de iarnă (25 oct 2026). → Task 2 teste.
3. **Tragere vs click în caruselul de destinații**: o tragere nu deschide cardul; un click scurt îl deschide. → Task 5 test.
4. **Redimensionare în timpul pin-ului din hero**: după resize, hubloul și textul revin la poziția corectă (ScrollTrigger refresh), fără salt. → Task 4 verificare.
5. **Fără JS / reduced-motion**: hero-ul arată starea finală lizibilă, nu un ecran gol cu text ascuns. → Task 4 și Task 7.

---

### Task 1: Proiectul Astro + fundația de design

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/scripts/motion.ts`, `src/pages/index.astro` (temporar), `tests/build.test.mjs`, `.claude/launch.json` (în `Proiect colaborare/hibrid`), `CLAUDE.md`
- Copy: `public/brand-logo.webp`, `public/brand-icon.png` din `../site/public/`

**Interfaces:**
- Produces: `<Base title description>` cu slot; CSS tokens `--bg --card --fg --muted --line --accent --accent-ink --sky-top --sky-bottom --radius --radius-lg --display --sans --italic --pad --ease-out --ease-inout`; clase `.btn .btn-primary .btn-ghost .label .kicker .wrap` (container centrat, `max-width: 1200px; margin-inline:auto; text-align:center`); `motion.ts` exportă `gsap, ScrollTrigger, SplitText, reducedMotion(): boolean, onPage(fn: () => (() => void) | void): void` — `onPage` rulează `fn` la fiecare `astro:page-load` și apelează cleanup-ul întors la `astro:before-swap`; `initMotion()` pornește Lenis o singură dată și reveal-urile `[data-split]`, `[data-reveal]`, `[data-count]`.

- [ ] **Step 1:** `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`, apoi `npm i gsap lenis` și `npm i -D tsx`. Script-uri: `"test": "node --import tsx --test tests/"`, `"check": "astro check"`.
- [ ] **Step 2: Write the failing test** `tests/build.test.mjs`: după `npm run build`, `dist/index.html` conține `lang="ro"`, link spre `fonts.googleapis.com` cu `Oswald`, și `<meta name="theme-color" content="#FAFAF9">`.
- [ ] **Step 3:** Run `npm run build && npm test` → FAIL (index minimal).
- [ ] **Step 4:** Scrie tokens, global (butoanele brandului, `.wrap` centrat, `:is(h1,h2,h3) em` în `--italic`), `Base.astro` (fonturi, favicon, `ClientRouter`, `initMotion()` într-un `<script>`), `motion.ts`. `--sky-top: #6FA8DC`, `--sky-bottom: #EEF5FB`.
- [ ] **Step 5:** Run `npm run build && npm test && npm run check` → PASS, 0 erori.
- [ ] **Step 6:** `CLAUDE.md` scurt: scop, link spre spec, reguli globale de mai sus. Launch config `hibrid` (`node node_modules/astro/bin/astro.mjs dev --port 4330`).
- [ ] **Step 7: Commit** `feat: fundația Astro, brand și mișcare`.

### Task 2: Conținut, configurare și logica evenimentelor

**Files:**
- Create: `src/config.ts`, `src/content.config.ts`, `src/content/destinations/*.json` (+ imaginile), `src/content/events/*.json`, `src/content/trips/*.json`, `src/data/faq.ts`, `src/data/photos.ts`, `src/lib/events.ts`, `tests/events.test.ts`
- Copy: `../site/src/content/destinations/*` (7 destinații), `../site/public/spiral/p*.webp` → `public/photos/`

**Interfaces:**
- Produces:
  - `config`: `{ PLATFORM, links: { club, travorium, calendar, academie, trips, comunitate }, whatsapp, email, social }` — `links.club = PLATFORM + '/club'`, `travorium '/club/travorium'`, `calendar '/club/calendar'`, `academie '/club/classroom'`, `trips '/club/trips'`, `comunitate '/club/comunitate'`.
  - Colecții: `destinations { name, country, continent: 'Asia'|'Europa'|'America'|'Africa'|'Orientul Mijlociu'|'Oceania', image, why: string, member: string[], order }`; `events { title, start: string /* ISO cu offset, ora București */, weekly: boolean, durationMin, summary, url }`; `trips { destination, dates: string, image, spotsNote?: string, order }`.
  - `photos: { src: string; thumb: string }[]` (54, din `public/photos/pNN.webp` / `pNN-s.webp`).
  - `nextOccurrence(ev: { start: string; weekly: boolean }, now: Date): Date | null` — pentru `weekly` întoarce prima apariție ≥ `now`, păstrând **ora de pe ceasul din `Europe/Bucharest`** (19:00 rămâne 19:00 și după schimbarea orei: se adună 7 zile la data calendaristică, apoi ora locală București se convertește în UTC cu offset-ul citit prin `Intl.DateTimeFormat(..., { timeZone:'Europe/Bucharest', timeZoneName:'longOffset' })`); altfel `start` dacă e ≥ `now`, altfel `null`.
  - `upcoming(events, now: Date, limit = 3): { ev, at: Date }[]` sortate crescător, fără `null`.
  - `formatLocal(at: Date, timeZone?: string): string` — `Intl.DateTimeFormat('ro-RO', { weekday:'long', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit', timeZone })`.
- Evenimente inițiale: „Zoom de prezentare – Cum poți avea vacanțe plătite”, `start: '2026-10-22T19:00:00+03:00'`, `weekly: true`; „Workshop live: Ce-ar fi dacă reclamele tale s-ar plăti singure?”, `start: '2026-11-04T17:00:00+02:00'`, `weekly: false`, ~90 min. URL-urile: `config.links.calendar`.

- [ ] **Step 1: Write the failing tests** `tests/events.test.ts`:
  - ora de iarnă (25 oct 2026): `nextOccurrence({start:'2026-10-22T19:00:00+03:00', weekly:true}, new Date('2026-10-23T10:00:00Z'))` → `2026-10-29T17:00:00.000Z` (tot 19:00 la București).
  - același eveniment, `now` = exact `2026-10-22T16:00:00Z` → `2026-10-22T16:00:00.000Z` (egal = încă viitor).
  - `nextOccurrence({start:'2026-11-04T17:00:00+02:00', weekly:false}, new Date('2026-11-05T00:00:00Z'))` → `null`.
  - `upcoming([zoom, workshop], new Date('2026-10-30T00:00:00Z')).map(x => x.at.toISOString())` → `['2026-11-04T15:00:00.000Z', '2026-11-05T17:00:00.000Z']`.
  - `formatLocal(new Date('2026-10-29T17:00:00Z'), 'Europe/London')` conține `17:00`; cu `'Europe/Bucharest'` conține `19:00`.
- [ ] **Step 2:** Run `npm test` → FAIL (`events.ts` lipsește).
- [ ] **Step 3:** Implementează `src/lib/events.ts`.
- [ ] **Step 4:** Run `npm test` → PASS.
- [ ] **Step 5:** Restul fișierelor de conținut (texte în ton, fără sume), schema în `content.config.ts`, `faq.ts` (6–8 întrebări din `../site` + despre platformă/login). Run `npm run check` → 0 erori.
- [ ] **Step 6: Commit** `feat: conținut, linkuri spre platformă și evenimente în ora locală`.

### Task 3: Meniul și footer-ul

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`; Modify: `src/layouts/Base.astro`; Test: `tests/build.test.mjs`

**Interfaces:**
- Consumes: `config.links`.
- Produces: `<Nav />` (logo centru; stânga Destinații, Travorium, Excursii; dreapta Calendar, Academie, Comunitate; buton galben „Intră în club” → `config.links.club`; link activ marcat cu `aria-current="page"`; burger + overlay sub 1100px; devine opac pe fundal alb după 40px scroll). `<Footer />` centrat: logo, tagline, linkurile paginilor, contact (email, WhatsApp, rețele), `© {an} Călătorul Antreprenor`. Fără rând legal (decizie a utilizatorului pe site-ul vechi).

- [ ] **Step 1: Write the failing test:** în `dist/index.html` există `href="https://calatorulantreprenor.com/club"` cu textul „Intră în club” și cele 6 linkuri `/destinatii /travorium /excursii /calendar /academie /comunitate`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementează. **Step 4:** Run `npm run build && npm test` → PASS.
- [ ] **Step 5:** Verificare vizuală 1440px în preview (logo exact centrat: `getBoundingClientRect` centrul logo-ului = `innerWidth/2 ± 1px`).
- [ ] **Step 6: Commit** `feat: meniu centrat și footer`.

### Task 4: Hero-ul cu hublou (punct de aprobare)

**Files:**
- Create: `public/hero/hublou-frame.webp` (ramă cu geamul transparent), `public/hero/sky.mp4` + `public/hero/sky.webp` (poster), `src/components/home/Hero.astro`, `src/scripts/hero.ts`; Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `onPage`, `gsap`, `ScrollTrigger`, `reducedMotion` din `motion.ts`.
- Produces: `<Hero />`; `initHero(root: HTMLElement): () => void` (cleanup). Elementul următor (`#destinatii`) e ținta în care „ieși din nori”.

- [ ] **Step 1: Media.** Din `../site/legacy/assets/hublou.jpg`: mască alfa pe ovalul geamului (elipsă ~ centru 488,598, raze ~245×325 în 960×1200 — se ajustează vizual) cu ffmpeg (`geq` alpha), ramă deschisă cu `eq=brightness=0.08:saturation=0.7` + ușor rece (`colorbalance` spre albastru), marginea întunecată estompată radial spre transparent → `hublou-frame.webp` (WebP cu alfa). Cer: caută în `../Assets/raw video/` un clip de zi deasupra norilor; dacă nu există, folosește `../site/legacy/assets/nori.jpg` ca poster și o derulare lentă CSS (fără video). Video: 1280px, ≤ 8s, buclă, fără sunet, ≤ 2 MB (`-crf 30 -an -movflags +faststart`).
- [ ] **Step 2:** Verifică vizual `hublou-frame.webp` peste un fundal albastru (Read pe un compozit ffmpeg). Dacă rama arată prea caldă/murdară: oprește-te și cere acordul pentru un hublou generat (spec §6).
- [ ] **Step 3: Implementează `<Hero />`**: secțiune `100vh`, cer (video, `object-fit:cover`) pe fundal; centrat: `<h1 data-split>Lumea se vede altfel <em>de la hublou.</em></h1>`, subtitlu („Comunitatea românilor care călătoresc mai mult și construiesc, în paralel, ceva al lor.”), buton „Urcă la bord” (→ `#destinatii`), hubloul sub text (înălțime ~46vh). Fără JS/reduced-motion: totul vizibil, fără pin.
- [ ] **Step 4: Implementează `initHero`**: ScrollTrigger `pin: true, scrub: 1, end: '+=150%'`; timeline: 0–0.3 textul `y:-80, autoAlpha:0`; 0.15–0.85 hubloul `scale` până acoperă ecranul (scale = `max(innerW/ovalW, innerH/ovalH) * 1.15`, calculat în funcție, recalculat la `refresh`); 0.7–1 un strat de nori albi `autoAlpha 0→1→0` ca trecere; `invalidateOnRefresh: true`.
- [ ] **Step 5: Verificare** (preview 1440×900): la progres 0 textul și hubloul sunt centrate (centrul hubloului = `innerWidth/2 ± 2px`); la progres 1 rama nu se mai vede (marginea interioară a ovalului e în afara viewport-ului). Resize la 1280×800 la mijlocul pin-ului, apoi verifică din nou cele două condiții (Review Focus 4). Reduced motion (emulat): fără pin, conținut vizibil. Console fără erori.
- [ ] **Step 6:** `npm run build && npm test && npm run check` → PASS. **Commit** `feat: hero cu hublou prin care treci la scroll`.
- [ ] **Step 7: CHECKPOINT** — screenshot + link localhost la utilizator; așteaptă aprobarea hero-ului înainte de Task 5.

### Task 5: Secțiunile de pe Acasă

**Files:**
- Create: `src/components/home/Destinations.astro` + `src/scripts/drag-carousel.ts`, `src/components/home/Trips.astro`, `src/components/home/Community.astro` + `src/components/Lightbox.astro` + `src/scripts/lightbox.ts`, `src/components/home/Crossroads.astro`, `src/components/home/Calendar.astro`, `src/components/Faq.astro`, `src/components/FinalCta.astro`, `src/components/IncomeNote.astro`; Modify: `src/pages/index.astro`; Test: `tests/build.test.mjs`

**Interfaces:**
- Consumes: colecțiile + `photos` + `upcoming/formatLocal` + `config.links` (Task 2), `onPage` (Task 1).
- Produces: `initDragCarousel(track: HTMLElement): () => void` (GSAP Draggable `type:'x'`, `inertia:true`, `bounds` = lățimea pistei, `dragClickables:true`; un click se anulează dacă deplasarea > 6px); `openLightbox(src: string, caption: string, from?: DOMRect)` (dialog nativ, FLIP de la `from`); `<IncomeNote />` (text fix: „Rezultatele diferă de la om la om și depind de timpul și efortul investit. Sumele prezentate sunt ilustrative.”); `<Faq items />`; `<FinalCta href label />`.

Secțiuni (ordinea §4 din spec), toate centrate:
- `#destinatii` „Unde ai putea să vii *cu noi.*” — carusel tras, card: poză, nume, țară, „prețuri de membru”, indicator „Trage →”; card → `/destinatii/[slug]`.
- „Următoarele *excursii.*” — bilete de avion (destinație, date, notă locuri) din `trips`, sub ele fâșie de 10 poze care derulează lent (marquee CSS).
- „O comunitate *cum nu ai mai văzut.*” — grilă/mozaic cu 12 poze din `photos`, click → lightbox; cifra `700+` cu `data-count`.
- Răscrucea „Doar călătorii? Sau *și business?*” — 2 carduri mari: Travorium (→ `/travorium`) și Academie (→ `/academie`) + `<IncomeNote />`.
- „Următoarele *întâlniri live.*” — `upcoming(events, new Date(), 3)` randat la build și **re-calculat în browser** (ora locală a vizitatorului, script mic care rescrie `<time datetime>`); buton „Rezervă-ți locul” → `config.links.calendar`.
- `<Faq />` + `<FinalCta href={config.links.club} label="Urcă la bord" />`.

- [ ] **Step 1: Write the failing tests** (build): `dist/index.html` conține `id="destinatii"`, 7 linkuri `/destinatii/`, textul „prețuri de membru”, „Doar călătorii?”, nota despre venituri, „Rezervă-ți locul” cu `href` spre `/club/calendar`, și **nu** conține regex `/\d+\s?(€|EUR|lei)/` (fără sume).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementează componentele. **Step 4:** Run → PASS.
- [ ] **Step 5: Verificare tragere vs click** (Review Focus 3) în preview: tragere 200px pe un card → URL-ul nu se schimbă și pista s-a mutat; click scurt pe card → navighează la `/destinatii/<slug>`.
- [ ] **Step 6:** Verificare vizuală 1440px a fiecărei secțiuni (centrare, reveal-uri), console fără erori. **Commit** `feat: secțiunile paginii Acasă`.

### Task 6: Paginile interioare

**Files:**
- Create: `src/components/PageHead.astro`, `src/pages/destinatii/index.astro`, `src/pages/destinatii/[slug].astro`, `src/pages/travorium.astro`, `src/pages/calendar.astro`, `src/pages/academie.astro`, `src/pages/excursii.astro`, `src/pages/comunitate.astro`, `src/scripts/filter.ts`; Test: `tests/build.test.mjs`

**Interfaces:**
- Consumes: tot ce produc Task 2 și 5 (`Faq`, `FinalCta`, `IncomeNote`, `openLightbox`, `upcoming`, `formatLocal`).
- Produces: `<PageHead kicker title em sub />` (cer cu nori care derivă lent, titlu centrat `data-split`); `initFilter(root: HTMLElement): () => void` (butoane `data-filter="<continent>"` ascund cardurile care nu se potrivesc; „Toate” le arată).

Conținut per pagină după tabelul §3 din spec; butonul final al fiecărei pagini → linkul din tabel (`config.links.*`). Travorium: beneficii (puncte, voucher de bun venit, cashback 3%, hoteluri 4–5★), 3 pași, chat/membri/sistem ca argumente, FAQ despre club. Academie: ce înveți, o săptămână tipică (4 workshop-uri live/lună), mentorul, `<IncomeNote />`. Comunitate: toate cele 54 de poze, lightbox, cifra 700+.

- [ ] **Step 1: Write the failing tests:** există `dist/{travorium,calendar,academie,excursii,comunitate}/index.html` și `dist/destinatii/<fiecare slug>/index.html`; fiecare pagină conține linkul ei spre platformă din tabel; `academie` conține nota despre venituri; nicio pagină nu conține sume (regex din Task 5) în afara etichetei „ilustrativ”.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementează. **Step 4:** Run → PASS.
- [ ] **Step 5:** Verificare: filtrul pe „Asia” arată doar destinațiile din Asia; lightbox-ul se deschide și se închide cu Esc; console fără erori. **Commit** `feat: paginile interioare`.

### Task 7: Trecerea cu nori între pagini + finisaj

**Files:**
- Create: `src/components/CloudTransition.astro`, `src/scripts/transition.ts`; Modify: `src/layouts/Base.astro`, `src/scripts/motion.ts`

**Interfaces:**
- Consumes: `ClientRouter` (Task 1), `onPage`.
- Produces: overlay fix cu 2–3 straturi de nori (`../site/legacy/assets/nori.jpg` → WebP, sau PNG-uri de nori cu alfa); la `astro:before-preparation` norii acoperă ecranul (0.6s, power3.inOut), la `astro:after-swap` + `astro:page-load` se retrag (0.8s). Reduced motion: fade simplu 0.2s.

- [ ] **Step 1: Write the failing check** (preview, Review Focus 1): navighează Acasă → Destinații → Acasă prin meniu; după întoarcere `ScrollTrigger.getAll().length` = numărul de la prima încărcare, hero-ul se fixează din nou la scroll, `document.documentElement.style.overflow` nu e `hidden`.
- [ ] **Step 2:** Rulează verificarea → eșuează fără cleanup-ul din `onPage` (dacă trece deja, notează și continuă).
- [ ] **Step 3:** Implementează tranziția și asigură-te că `onPage` omoară ScrollTrigger-ele și Draggable-urile paginii la `astro:before-swap`; Lenis se resetează la top la `astro:after-swap`.
- [ ] **Step 4:** Rulează din nou verificarea → PASS; plus: JS dezactivat (sau `<noscript>` audit) → textele vizibile pe toate paginile (Review Focus 5).
- [ ] **Step 5: Performanță:** `npm run build`; suma JS inițial din `dist/_astro/*.js` încărcat pe `/` < 150 KB (gzip), `sky.mp4` < 2 MB, nicio imagine > 400 KB pe Acasă. **Commit** `feat: trecere cu nori între pagini`.
- [ ] **Step 6:** Raport final către utilizator cu link localhost și ce să testeze. Fără push/deploy până nu cere.

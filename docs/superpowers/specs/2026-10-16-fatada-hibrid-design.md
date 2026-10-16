# Fațada „Călătorul Antreprenor” (hibrid) — design

Data: 2026-10-16 · Stare: aprobat pe secțiuni în conversație, așteaptă review-ul scris.

## 1. Scop

Un site public, **separat** de site-ul de pe Vercel (`calatorul-antreprenor.vercel.app`, care rămâne neatins), care e **fațada** platformei de membri de pe `calatorulantreprenor.com/club` (cere login).

- Pentru cine: comunitatea existentă (un „facelift” al prezenței publice) și oameni noi.
- Ce trebuie să facă: să te cucerească întâi cu călătoriile și comunitatea, apoi să te întrebe „doar călătorii sau și business?” și să te ducă în secțiunea potrivită din platformă.
- Succes: un vizitator nou înțelege în primul minut ce e clubul, vede oameni reali în excursii reale și ajunge la „Intră în club” / „Rezervă-ți locul” la Zoom; un membru recunoaște brandul platformei.

Surse: hero-ul cu hublou din landing-ul vechi (`mariostan5.github.io/landing-page`, copie în `site/legacy/`) + ritmul și mișcarea de pe travelnextlvl.de (hero fixat la scroll, carusel tras cu mouse-ul, tipografie înaltă, cer).

## 2. Direcție vizuală

- **Atmosferă „cer deschis”**: cer albastru de zi cu nori, lumină de dimineață. Galbenul brandului doar pe butoane și accente mici.
- **Totul centrat**: titluri, texte, butoane, carduri în coloane centrate; nimic aliniat la stânga ca regulă de layout.
- **Brandul platformei** (citit de pe calatorulantreprenor.com): galben `#FACC15` (butoane, cu text negru), albastru `#115089` (linii, accente mici), fundal alb cald `#FAFAF9`, carduri albe cu bordură `#E7E5E4`, colțuri 6px butoane / 12px carduri. Titluri Oswald 600–700, text Inter; un cuvânt-cheie per titlu în serif italic (`<em>`), cu punctuația înăuntru. Logo: `brand-logo.webp` (rotund) din site-ul actual.
- Fără temă întunecată în prima versiune.

## 3. Pagini și legături spre platformă

Meniu: logo în centru, 3 linkuri stânga + 3 dreapta, buton galben „Intră în club” (→ `https://calatorulantreprenor.com/club`). Burger sub 1100px.

| Pagina | Conținut public | Butonul final duce la |
|---|---|---|
| Acasă `/` | vezi §4 | `/club` |
| Destinații `/destinatii` + `/destinatii/[slug]` | grilă cu filtru pe continent; pagină per destinație: poză pe tot ecranul, „de ce merită”, „ce primești ca membru”, poze ale clubului de acolo dacă există | `/club/travorium` |
| Travorium `/travorium` | ce e clubul, beneficii (puncte, voucher de bun venit, cashback 3%, hoteluri 4–5★), cum intri în 3 pași, chat / membri / sistem ca argumente, întrebări | `/club/travorium` |
| Calendar `/calendar` | evenimente publice cu dată, oră, „Detalii” | `/club/calendar` |
| Academie `/academie` | ce înveți (marketing, vânzări, social media, AI), o săptămână tipică, mentorul, nota despre venituri | `/club/classroom` |
| Excursii de grup `/excursii` | excursiile care vin (ca bilete de avion) + galerie pe destinații din excursiile trecute | `/club/trips` |
| Comunitate `/comunitate` | galerie mare cu poze din Travorium + povești scurte, cifra 700+ | `/club/comunitate` |

Chat, Membri și System din platformă nu primesc pagini; apar ca argumente pe Travorium. Contact (email, WhatsApp, rețele) stă în footer. Fără blog în prima versiune.

## 4. Pagina Acasă (în ordine)

1. **Meniu** (§3).
2. **Hero cu hublou** — din cabină: peretele avionului cu hubloul în centru, norii prin geam (§6). Centrat peste hublou: kicker, titlu „Mergi cu noi *în vacanțe?*”, buton „Urcă la bord”, indicator „Derulează și treci prin hublou”. La scroll secțiunea e fixată (pin, ~250vh): textul urcă și se estompează, hubloul crește până umple ecranul, treci prin geam în nori, iar din nori apare secțiunea următoare.
3. **Destinații** — carusel tras cu mouse-ul/degetul; card: poză, nume, țară, „prețuri de membru” (fără sume). Click → pagina destinației.
4. **Excursii de grup** — următoarele excursii ca bilete de avion + o fâșie de poze din excursiile trecute.
5. **Comunitate** — poze din Travorium care se măresc la click (lightbox), cifra „700+ români din toată lumea”.
6. **Răscrucea** — „Doar călătorii? Sau *și business?*”: două carduri mari, Travorium (vacanțe, voucher, cashback) și Academie (construiești ceva al tău, cu nota despre venituri).
7. **Calendar** — următoarele evenimente; primul: Zoom săptămânal, joi 19:00, „Cum poți avea vacanțe plătite”, buton „Rezervă-ți locul”.
8. **Întrebări** (acordeon) + **CTA final** „Urcă la bord” + footer.

## 5. Mișcare

- Lenis pentru scroll fin; GSAP ScrollTrigger pentru pin-uri și reveal-uri, SplitText pentru titluri.
- Titluri: rânduri care urcă din mască (0.08s între ele). Imagini: se deschid din mască, 115% → 100%. Cifre: de la 0 în 1.6s, tabular-nums. Curbe: expo.out la apariții, power3.inOut la tranziții; fără bounce/elastic.
- Caruselul de destinații: drag cu inerție (GSAP Draggable + Inertia, gratuite în GSAP 3.13+), indicator „Trage”.
- **Trecere între pagini**: un val de nori care acoperă ecranul și se retrage (Astro View Transitions / `ClientRouter` + overlay GSAP).
- `prefers-reduced-motion`: doar fade-uri, fără pin; hero-ul arată direct starea finală. Textul e lizibil fără JavaScript.

## 6. Hubloul

(Schimbat la cererea utilizatorului, 2026-10-16.) Hero-ul pornește **din cabină**: peretele avionului (poza cu hublou albastru-deschis primită de la utilizator, extinsă lateral cu culoarea peretelui, geamul decupat) umple ecranul, iar prin geam se văd norii la răsărit (a doua poză primită). Titlul „Mergi cu noi *în vacanțe?*” stă centrat peste hublou. La scroll peretele crește în jurul geamului până treci prin el, norii se apropie (118% → 100%), apoi un văl de nor duce în secțiunea următoare. Fișiere: `public/hero/cabin-wall.webp`, `public/hero/clouds.webp`.

## 7. Conținut și date

- Texte, destinații, evenimente, excursii: fișiere în `src/content/` (JSON) și `src/config.ts`, editabile ușor; nimic nu se citește automat din platformă (cere login).
- Poze: cele 54 de fotografii din Travorium deja pregătite în `site/public/spiral/` (`pNN.webp`, `pNN-s.webp`), destinațiile din `site/src/content/destinations/` și `site/legacy/assets/`.
- Evenimente inițiale: Zoom „Cum poți avea vacanțe plătite” (joi 19:00, săptămânal) și workshop-ul „Ce-ar fi dacă reclamele tale s-ar plăti singure?” (mie 4 nov 2026, 17:00).
- Ton: „proces, timp, efort, sprijin, rezultate care diferă de la om la om”. Fără „bani ușori”, „venit pasiv garantat”, „renunță la job”; sume doar cu eticheta „ilustrativ”; nota despre venituri pe Academie și pe Răscruce.
- Placeholdere încă de completat (din site-ul actual): număr WhatsApp, rețele sociale, email.

## 8. Tehnic și livrare

- Proiect nou în `Proiect colaborare/hibrid` (Astro + GSAP + Lenis, fonturi Google), repo GitHub separat, publicat pe Vercel la o adresă nouă (ex. `calatorul-fatada.vercel.app`); domeniul se alege la final.
- Performanță: LCP sub 2.5s pe 4G, JS inițial sub 150 KB, imagini AVIF/WebP, video-ul de cer sub 2 MB.
- Ordinea: (1) hero-ul cu hubloul → aprobare; (2) restul secțiunilor de pe Acasă; (3) cele 6 pagini; (4) trecerea cu nori între pagini.
- Verificare după fiecare bucată: `astro check` + build, verificare vizuală pe 1440px (desktop întâi; mobilul 375px mai târziu, la cerere).
- GitHub/Vercel: push și publicare doar când cere utilizatorul.

## 9. În afara primei versiuni

Blog/jurnal, temă întunecată, sincronizare automată a calendarului cu platforma, formular de contact cu backend, versiunea în engleză.

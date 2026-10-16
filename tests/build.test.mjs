// Checks on the built site (run `npm run build` first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

export const page = (p = 'index.html') => readFileSync(new URL(`../dist/${p}`, import.meta.url), 'utf8');

test('the base layout: Romanian, brand fonts, light theme colour', () => {
  const html = page();
  assert.match(html, /<html lang="ro"/);
  assert.match(html, /fonts\.googleapis\.com\/css2\?[^"]*Oswald/);
  assert.match(html, /<meta name="theme-color" content="#FAFAF9"/);
});

test('the menu: the six pages and "Urcă la bord" into the platform', () => {
  const html = page();
  const right = html.match(/<div class="nav-side nav-right"[\s\S]*?<\/div>/)[0];
  assert.match(right, /href="https:\/\/calatorulantreprenor\.com\/club"[^>]*>[^<]*Urcă la bord/);
  for (const p of ['/destinatii', '/travorium', '/excursii', '/calendar', '/academie', '/comunitate'])
    assert.match(html, new RegExp(`href="${p}"`), p);
});

const MONEY = /\d[\d.,]*\s?(€|EUR|euro|lei|RON|\$)/i;

test('home: destinations, trips, community, crossroads, calendar, FAQ', () => {
  const html = page();
  assert.match(html, /id="destinatii"/);
  assert.equal(new Set(html.match(/href="\/destinatii\/[a-z-]+"/g)).size, 7);
  assert.match(html, /prețuri de membru/);
  assert.match(html, /Doar călătorii\?/);
  assert.match(html, /Rezultatele diferă de la om la om/);
  assert.match(html, /href="https:\/\/calatorulantreprenor\.com\/club\/calendar"[^>]*>[^<]*Rezervă-ți locul/);
  assert.match(html, /<details/);
});

test('home: no money amounts', () => {
  assert.doesNotMatch(page().replace(/<script[\s\S]*?<\/script>/g, ''), MONEY);
});

const PAGES = {
  'travorium/index.html': 'https://calatorulantreprenor.com/club/travorium',
  'calendar/index.html': 'https://calatorulantreprenor.com/club/calendar',
  'academie/index.html': 'https://calatorulantreprenor.com/club/classroom',
  'excursii/index.html': 'https://calatorulantreprenor.com/club/trips',
  'comunitate/index.html': 'https://calatorulantreprenor.com/club/comunitate',
  'destinatii/index.html': 'https://calatorulantreprenor.com/club/travorium',
};

test('inner pages exist and each leads to its part of the platform', () => {
  for (const [p, href] of Object.entries(PAGES)) assert.match(page(p), new RegExp(`href="${href}"`), p);
});

test('every destination has its page', () => {
  for (const slug of ['bali', 'cancun', 'danang', 'dubai', 'las-vegas', 'phuket', 'shanghai'])
    assert.match(page(`destinatii/${slug}/index.html`), /<h1/, slug);
});

test('the Academie page carries the income note', () => {
  assert.match(page('academie/index.html'), /Rezultatele diferă de la om la om/);
});

test('inner pages show no money amounts', () => {
  for (const p of Object.keys(PAGES)) assert.doesNotMatch(page(p).replace(/<script[\s\S]*?<\/script>/g, ''), MONEY, p);
});

test('hero: the name on two lines, a logo intro, nothing else', () => {
  const hero = page().match(/<section class="hero"[\s\S]*?<\/section>/)[0];
  assert.match(hero, /<h1[^>]*>[\s\S]*Călătorul[\s\S]*Antreprenor[\s\S]*<\/h1>/);
  assert.match(hero, /class="intro"[^>]*hidden/);
  assert.match(hero, /brand-logo\.webp/);
  assert.doesNotMatch(hero, /Mergi cu noi|Clubul românilor care călătoresc|Urcă la bord/);
});

test('home: destinations loop (a hidden copy for a seamless marquee), no white veil after the hero', () => {
  const html = page();
  const track = html.match(/<ul class="dest-track"[\s\S]*?<\/ul>/)[0];
  assert.match(track, /data-marquee/);
  assert.equal((track.match(/class="dest-card"/g) || []).length, 14);
  assert.match(track, /<li[^>]*aria-hidden="true"/);
  assert.doesNotMatch(html, /class="hero-veil"/);
});

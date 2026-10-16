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

test('the menu: the six pages and "Intră în club" into the platform', () => {
  const html = page();
  assert.match(html, /href="https:\/\/calatorulantreprenor\.com\/club"[^>]*>[^<]*Intră în club/);
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

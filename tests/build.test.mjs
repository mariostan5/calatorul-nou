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

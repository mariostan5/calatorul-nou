import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextOccurrence, upcoming, formatLocal } from '../src/lib/events.ts';

const zoom = { start: '2026-10-22T19:00:00+03:00', weekly: true };
const workshop = { start: '2026-11-04T17:00:00+02:00', weekly: false };

test('a weekly event stays at 19:00 Bucharest time across the switch to winter time', () => {
  assert.equal(nextOccurrence(zoom, new Date('2026-10-23T10:00:00Z'))?.toISOString(), '2026-10-29T17:00:00.000Z');
});

test('an event starting exactly now is still upcoming', () => {
  assert.equal(nextOccurrence(zoom, new Date('2026-10-22T16:00:00Z'))?.toISOString(), '2026-10-22T16:00:00.000Z');
});

test('a one-off event in the past has no next occurrence', () => {
  assert.equal(nextOccurrence(workshop, new Date('2026-11-05T00:00:00Z')), null);
});

test('upcoming events come in date order', () => {
  const got = upcoming([zoom, workshop], new Date('2026-10-30T00:00:00Z')).map((x) => x.at.toISOString());
  assert.deepEqual(got, ['2026-11-04T15:00:00.000Z', '2026-11-05T17:00:00.000Z']);
});

test('times are shown in the visitor\'s own time zone', () => {
  const at = new Date('2026-10-29T17:00:00Z');
  assert.match(formatLocal(at, 'Europe/London'), /17:00/);
  assert.match(formatLocal(at, 'Europe/Bucharest'), /19:00/);
});

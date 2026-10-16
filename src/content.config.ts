import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const destinations = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/destinations' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    country: z.string(),
    continent: z.enum(['Asia', 'Europa', 'America', 'Africa', 'Orientul Mijlociu', 'Oceania']),
    image: image(),
    why: z.string(),
    member: z.array(z.string()),
    order: z.number(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    /** ISO with the Bucharest offset, e.g. 2026-10-22T19:00:00+03:00 */
    start: z.string(),
    weekly: z.boolean(),
    durationMin: z.number(),
    summary: z.string(),
  }),
});

const trips = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/trips' }),
  schema: z.object({
    destination: reference('destinations'),
    dates: z.string(),
    summary: z.string(),
    start: z.coerce.date(),
    order: z.number(),
  }),
});

export const collections = { destinations, events, trips };

import type { WealthArticleContent, WealthArticleMeta } from './types';

import exposeWsj from './expose-wsj';

export const wealthArticleModules: WealthArticleContent[] = [
  exposeWsj,
];

export const wealthArticlesMeta: WealthArticleMeta[] = [
  {
    slug: 'expose-wsj',
    title: 'The RM70 Billion Question',
    subtitle: "How Malaysia's Biggest Gas Deal Was Structured — and Who Was Left Out of the Room",
    date: '2026-06-07',
    domain: 'SEARAH × PETROS',
    language: 'en',
    excerpt: 'SEARAH Limited registered in London, ENI House. USD 15 billion regional gas/LNG hub. 300-500 kboe/d production target. The independent market data converges on the size, structure, and strategic positioning.',
    tags: ['petronas', 'petros', 'searah', 'eni', 'lng', 'rm70b', 'investigative'],
    seal: '999',
  },
];

export function getWealthArticle(slug: string): WealthArticleContent | undefined {
  return wealthArticleModules.find(a => a.slug === slug);
}

export function getWealthMeta(slug: string): WealthArticleMeta | undefined {
  return wealthArticlesMeta.find(a => a.slug === slug);
}

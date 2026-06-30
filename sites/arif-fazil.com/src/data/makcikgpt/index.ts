import type { ArticleContent, MakcikArticleMeta } from './types';

import ceritaMakcik from './cerita-makcik';
import siasatanHarakah from './siasatan-harakah';
import iranHormuz from './iran-hormuz';

export const makcikArticleModules: ArticleContent[] = [
  ceritaMakcik,
  siasatanHarakah,
  iranHormuz,
];

export const makcikArticlesMeta: MakcikArticleMeta[] = [
  {
    slug: 'cerita-makcik',
    title: 'Kenapa Gas Sarawak Punya Dah Masuk Tangan Orang Italy?',
    subtitle: 'Cerita dari Makcik Pasar Malam — untuk jiran-jiran yang nak tahu apa jadi kat duit minyak kita',
    date: '2026-06-07',
    domain: 'SEARAH × PETROS',
    language: 'ms',
    excerpt: 'Gas dari bumi Sarawak, syarikat daftar kat London. Alamat kat ENI House — syarikat minyak gergasi Italy. Makcik, hang tau tak gas yang keluar dari bumi Sarawak tu kat mana pergi?',
    tags: ['petronas', 'petros', 'searah', 'sarawak', 'gas', 'lng', 'eni'],
    seal: '999',
  },
  {
    slug: 'siasatan-harakah',
    title: 'Persoalan RM70 Bilion',
    subtitle: 'Bagaimana Struktur Perjanjian Gas Terbesar Malaysia — dan Siapa yang Tidak Termasuk dalam Bilik',
    date: '2026-06-07',
    domain: 'SEARAH × PETROS',
    language: 'ms',
    excerpt: 'Amanah PETRONAS dikhianati. Lembaga Pengarah diam. PETROS ambil gas Sarawak senyap-senyap. VSS/MSS ~5,000 pekerja. OSA bisu whistleblower.',
    tags: ['petronas', 'petros', 'searah', 'whistleblower', 'osa', 'vss', 'malaysia'],
    seal: '999',
  },
  {
    slug: 'iran-hormuz',
    title: 'Iran Hormuz dan Malaysia: Rightsizing Tak Habis-Habis, Macam Perang Israel',
    subtitle: 'MakcikGPT bersuara — untuk makcik-makcik yang baca berita dekat WhatsApp dan tertanya-tanya: "Apa kena-mengena dengan kita?"',
    date: '2026-06-30',
    domain: 'MAKCIKGPT × PETRONAS',
    language: 'ms',
    excerpt: 'Hormuz tutup-buka, harga minyak dunia tak menentu. PETRONAS rightsizing berkali-kali padahal negara masih bergantung minyak & gas. Tiga teguran makcik: Lembaga Pengarah jangan senyap, jangan buang orang sesuka hati, jangan alih aset strategik tanpa cerita.',
    tags: ['petronas', 'hormuz', 'iran', 'rightsizing', 'minyak', 'gas', 'malaysia'],
    seal: '999',
  },
];

export function getMakcikArticle(slug: string): ArticleContent | undefined {
  return makcikArticleModules.find(a => a.slug === slug);
}

export function getMakcikMeta(slug: string): MakcikArticleMeta | undefined {
  return makcikArticlesMeta.find(a => a.slug === slug);
}

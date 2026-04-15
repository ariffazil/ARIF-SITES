export interface Essay {
  id: string;
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  tags: string[];
}

export const essays: Essay[] = [
  {
    id: 'dry-holes-to-constitutional-ai',
    title: 'From Dry Holes to Constitutional AI',
    date: '2026-03-15',
    slug: 'dry-holes-to-constitutional-ai',
    excerpt: 'What signing off on a $100MM well teaches you about machine intelligence: uncertainty is not a bug, it is the operating condition.',
    tags: ['Geoscience', 'AI Governance', 'arifOS']
  },
  {
    id: 'fertilizer-cascade',
    title: 'The Fertilizer Cascade',
    date: '2025-08-22',
    slug: 'fertilizer-cascade',
    excerpt: 'Malaysia imports energy. Malaysia imports food inputs. What happens when both transit through the same chokepoint? A geological and geopolitical risk assessment.',
    tags: ['Geopolitics', 'Energy Security', 'Malaysia']
  },
  {
    id: 'sabah-deepwater',
    title: 'Why Malaysia Needs Sabah Deepwater',
    date: '2025-05-10',
    slug: 'sabah-deepwater',
    excerpt: 'The geological reality: 350,000 boepd is a natural depletion plateau. The only material near-term source of new crude is 1,500–3,000m below the South China Sea.',
    tags: ['Petroleum Geology', 'Exploration', 'Policy']
  },
  {
    id: 'building-arifos',
    title: 'Building arifOS: A Field Geologist\'s Approach to Machine Intelligence',
    date: '2026-01-08',
    slug: 'building-arifos',
    excerpt: 'I did not set out to build an AI framework. I set out to encode the conditions under which I would sign my name to an irreversible decision.',
    tags: ['arifOS', 'Constitutional AI', 'Engineering']
  },
  {
    id: 'ditempa-bukan-diberi',
    title: 'Ditempa Bukan Diberi',
    date: '2024-11-30',
    slug: 'ditempa-bukan-diberi',
    excerpt: 'Forged, not given. On the Malay craftsman ethic and why it matters for software, science, and sovereignty in the age of generative everything.',
    tags: ['Philosophy', 'Culture', 'Technology']
  }
];

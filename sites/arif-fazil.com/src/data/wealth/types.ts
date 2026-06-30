export interface WealthArticleContent {
  slug: string;
  html: string;
}

export interface WealthArticleMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  domain: string;
  language: 'ms' | 'en' | 'bilingual';
  excerpt: string;
  tags: string[];
  seal: string;
}

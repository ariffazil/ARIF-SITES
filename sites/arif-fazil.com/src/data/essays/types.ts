export interface EssayContent {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  excerpt: string;
  mediumUrl: string;
  html: string;
  isDirectPublication?: boolean;
}

export interface EssayMeta {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  tags: string[];
  mediumUrl: string;
  isDirectPublication?: boolean;
  domain?: string;
}

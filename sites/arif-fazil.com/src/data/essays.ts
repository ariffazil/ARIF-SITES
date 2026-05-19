export interface Essay {
  id: string;
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  tags: string[];
  mediumUrl: string;
}

// Add essays here ONLY when they are confirmed published on Medium
export const essays: Essay[] = [];

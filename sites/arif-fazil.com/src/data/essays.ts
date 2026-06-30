export interface Essay {
  id: string;
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  tags: string[];
  mediumUrl: string;
}

// Re-export from the essays data directory
export { essayModules as essays, getEssay, curatedEssays } from './essays/index';

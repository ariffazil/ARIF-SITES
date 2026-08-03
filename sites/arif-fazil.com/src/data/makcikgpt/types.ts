export type EpistemicTag = 'OBS' | 'DER' | 'INT' | 'SPEC';
export type MaruahReviewStatus = 'approved' | 'pending' | 'not_applicable';
export type ProvenanceStatus = 'legacy' | 'migrating' | 'sealed';

export interface ClaimItem {
  claim_id: string;
  text: string;
  tag: EpistemicTag;
  source_id?: string;
  confidence_basis?: string;
  maruah_review?: MaruahReviewStatus;
}

export interface SourceItem {
  source_id: string;
  type: 'filing' | 'document' | 'court_record' | 'news' | 'official_statement' | 'analysis';
  title: string;
  url: string;
  archived_url?: string;
  retrieved_at?: string;
  content_hash?: string;
}

export interface CounterEvidenceItem {
  source_id?: string;
  summary: string;
  disposition: string;
}

export interface VersionLineage {
  version: string;
  published: string;
  last_updated: string;
  supersedes?: string;
  superseded_by?: string;
}

export interface ArticleContent {
  slug: string;
  html: string;
}

export interface MakcikArticleMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  domain: string;
  language: 'ms' | 'en' | 'bilingual';
  excerpt: string;
  tags: string[];
  seal: string;

  // APEX Provenance & Claim Register Schema
  provenance_status?: ProvenanceStatus;
  claim_register?: ClaimItem[];
  source_ledger?: SourceItem[];
  counter_evidence?: CounterEvidenceItem[];
  version_lineage?: VersionLineage;
  merkle_leaf?: string;
}


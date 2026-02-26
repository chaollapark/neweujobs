export interface ScrapedConsultancy {
  slug: string;
  name: string;
  logoUrl?: string;
  description?: string;
  ownership?: string;
  brusselsOfficeSince?: string;
  staffCount?: string;
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  specialisms?: string[];
  linkedConsultants?: string[];
  sourceUrl: string;
}

export interface ScrapedConsultant {
  slug: string;
  name: string;
  title?: string;
  organization?: string;
  organizationSlug?: string;
  email?: string;
  photoUrl?: string;
  myJob?: string;
  experience?: string[];
  specialisms?: string[];
  achievements?: string;
  education?: string[];
  languages?: string[];
  interests?: string;
  sourceUrl: string;
}

export interface ScrapedLawFirm {
  slug: string;
  name: string;
  logoUrl?: string;
  description?: string;
  specialisms?: string[];
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  keyPartners?: string[];
  sourceUrl: string;
}

export interface ScrapedIntelligenceSystem {
  slug: string;
  name: string;
  logoUrl?: string;
  description?: string;
  features?: string[];
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  sourceUrl: string;
}

export interface ScrapedDigitalTool {
  slug: string;
  name: string;
  logoUrl?: string;
  description?: string;
  services?: string[];
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  sourceUrl: string;
}

export interface ScrapedTrainer {
  slug: string;
  name: string;
  logoUrl?: string;
  description?: string;
  programs?: string[];
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  sourceUrl: string;
}

export interface ScrapedSpecialistCategory {
  slug: string;
  name: string;
  type?: 'sector' | 'service';
  description?: string;
  consultancies?: string[];
  lawFirms?: string[];
  sourceUrl: string;
}

export interface ScrapedArticle {
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  author?: string;
  publishedDate?: string;
  featuredImage?: string;
  sourceUrl: string;
}

export interface ScrapedEditorialPage {
  slug: string;
  title: string;
  section?: string;
  content?: string;
  parentSlug?: string;
  sortOrder?: number;
  sourceUrl: string;
}

export interface ProgressData {
  scraped: string[];
  rewritten: string[];
  saved: string[];
  errors: Array<{ url: string; error: string; phase: string; timestamp: string }>;
  lastRun: string;
}

export type ContentType =
  | 'consultancy'
  | 'consultant'
  | 'lawFirm'
  | 'intelligenceSystem'
  | 'digitalTool'
  | 'trainer'
  | 'specialist'
  | 'article'
  | 'editorial';

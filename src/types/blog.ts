export type BlogCategory =
  | 'post-surgical'
  | 'elderly-care'
  | 'wound-care'
  | 'catheter-care'
  | 'ivf-infusion'
  | 'caregiver-guides';

export interface ClinicalReviewer {
  name: string;
  role: string;
  credentials: string; // e.g., "GNM, B.Sc. Nursing (16+ Years Experience)"
  registrationCouncil: string;
  verifiedBadge: boolean;
}

export interface EmergencyRedFlag {
  sign: string;
  actionRequired: string;
  urgency: 'IMMEDIATE_EMERGENCY' | 'CALL_NURSE_PROMPTLY' | 'MONITOR_CLOSELY';
}

export interface StepGuidance {
  stepNumber: number;
  title: string;
  description: string;
  sterileTip?: string;
}

export interface ClinicalArticleFaq {
  question: string;
  answer: string;
}

export interface ClinicalArticle {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  category: BlogCategory;
  categoryLabel: string;
  readTimeMinutes: number;
  publishedAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  heroImage: {
    src: string;
    alt: string;
  };
  author: {
    name: string;
    role: string;
  };
  clinicalReviewer: ClinicalReviewer;
  tableOfContents: {
    id: string;
    title: string;
  }[];
  keyTakeaways: string[];
  emergencyRedFlags: EmergencyRedFlag[];
  clinicalSteps?: StepGuidance[];
  contentSections: {
    id: string;
    heading: string;
    paragraphs: string[];
    callout?: {
      type: 'warning' | 'info' | 'tip';
      title: string;
      text: string;
    };
    bulletPoints?: string[];
  }[];
  relatedServiceSlugs: string[];
  relatedLocationSlugs: string[];
  faqs: ClinicalArticleFaq[];
}

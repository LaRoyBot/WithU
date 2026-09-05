export type BlogCategory =
  | 'post-surgical'
  | 'elderly-care'
  | 'wound-care'
  | 'catheter-care'
  | 'ivf-infusion'
  | 'caregiver-guides';

export type QuestionUrgency = 'CRITICAL' | 'PRACTICAL' | 'CURIOUS';

export interface ClinicalQuestionAnswer {
  id: string;
  category: QuestionUrgency; // Critical vs Practical vs Curious
  question: string;
  shortAnswer: string;
  detailedAnswer: string[];
  clinicalSignificance?: string; // e.g. Why this matters biologically or medically
  whatToLookFor?: string[]; // concrete warning signs or symptoms
  practicalProtocol?: string[]; // step-by-step guidance
  whenToContactProfessional: string; // Guidance on when to visit hospital or arrange home clinical care at neethanursing.in
}

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
  // Structured FAQ categories
  criticalQuestions: ClinicalQuestionAnswer[];
  practicalQuestions: ClinicalQuestionAnswer[];
  curiousQuestions: ClinicalQuestionAnswer[];
  // Deep editorial content sections
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
}


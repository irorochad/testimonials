import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { users, projects, groups, testimonials, integrations, invitations, subscriptions, forms, formSubmissions } from './schema';

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Project types
export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

// Group types
export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

// Testimonial types
export type Testimonial = InferSelectModel<typeof testimonials>;
export type NewTestimonial = InferInsertModel<typeof testimonials>;

// Integration types
export type Integration = InferSelectModel<typeof integrations>;
export type NewIntegration = InferInsertModel<typeof integrations>;

// Invitation types
export type Invitation = InferSelectModel<typeof invitations>;
export type NewInvitation = InferInsertModel<typeof invitations>;

// Subscription types
export type Subscription = InferSelectModel<typeof subscriptions>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;

// Form types
export type Form = InferSelectModel<typeof forms>;
export type NewForm = InferInsertModel<typeof forms>;

// Form submission types
export type FormSubmission = InferSelectModel<typeof formSubmissions>;
export type NewFormSubmission = InferInsertModel<typeof formSubmissions>;

// Public page settings interface
export interface PublicPageSettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  layout: 'grid' | 'masonry' | 'list';
  showRatings: boolean;
  showCompany: boolean;
  showTitle: boolean;
  showImages: boolean;
  headerTitle?: string;
  headerDescription?: string;
  customCSS?: string;
}

// Extended types with business logic
export interface UserWithSubscription extends User {
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: Date | null;
  };
}

export interface ProjectWithStats extends Project {
  totalTestimonials: number;
  pendingApprovals: number;
  approvalRate: number;
}

export interface TestimonialWithProject extends Testimonial {
  project: {
    name: string;
    embedCode: string;
  };
}

export interface GroupWithStats extends Group {
  testimonialCount: number;
  approvedCount: number;
  pendingCount: number;
  averageRating: number | null;
}

export interface TestimonialWithGroup extends Testimonial {
  group?: {
    id: string;
    name: string;
    color: string;
  };
}

// Widget configuration types
export interface WidgetDisplaySettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  layout: 'carousel' | 'grid' | 'list';
  showRatings: boolean;
  showCompany: boolean;
  showTitle: boolean;
  maxTestimonials: number;
  widgetType: 'basic' | 'custom';
}

export interface WidgetConfig {
  projectId: string;
  displaySettings: WidgetDisplaySettings;
  customCSS?: string;
  allowedDomains: string[];
}

export interface WidgetTestimonial {
  id: string;
  customerName: string;
  customerCompany?: string;
  customerTitle?: string;
  customerImageUrl?: string;
  content: string;
  rating?: number;
  tags?: string[];
  createdAt: Date;
}

// API response types
export interface PublicTestimonial {
  id: string;
  customerName: string;
  customerCompany?: string;
  customerTitle?: string;
  customerImageUrl?: string;
  content: string;
  rating?: number;
  createdAt: Date;
}

export interface TestimonialSubmission {
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  customerTitle?: string;
  customerImageUrl?: string;
  content: string;
  rating?: number;
  source: 'manual' | 'email_invite' | 'scraped' | 'integration' | 'imported';
  sourceMetadata?: Record<string, unknown>;
}

export interface SubmissionResult {
  success: boolean;
  testimonialId?: string;
  message: string;
}

// Integration types
export type IntegrationType = 'zendesk' | 'intercom' | 'helpscout' | 'freshdesk';

export interface ServiceCredentials {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  subdomain?: string;
  [key: string]: unknown;
}

export interface SyncResult {
  success: boolean;
  imported: number;
  errors: string[];
  lastSyncAt: Date;
}

// AI-related types
export interface PromptFlow {
  questions: string[];
  context: string;
  followUpQuestions: Record<string, string[]>;
}

export interface ContentSuggestions {
  headlines: string[];
  summary: string;
  keyPhrases: string[];
}

export interface TestimonialInsights {
  commonThemes: string[];
  sentimentScore: number;
  keywordFrequency: Record<string, number>;
  featurePopularity: Record<string, number>;
}

export interface ThemeAnalysis {
  themes: Array<{
    name: string;
    frequency: number;
    sentiment: number;
    examples: string[];
  }>;
}

export interface MarketingCopySuggestions {
  headlines: string[];
  taglines: string[];
  bulletPoints: string[];
  socialProof: string[];
}

// Import/Export types
export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

export interface ScrapedTestimonial {
  customerName: string;
  content: string;
  rating?: number;
  sourceUrl: string;
  extractedAt: Date;
}

// Status enums
export const TestimonialStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FLAGGED: 'flagged',
} as const;

export const TestimonialSource = {
  MANUAL: 'manual',
  EMAIL_INVITE: 'email_invite',
  SCRAPED: 'scraped',
  INTEGRATION: 'integration',
  IMPORTED: 'imported',
} as const;

export const InvitationStatus = {
  SENT: 'sent',
  OPENED: 'opened',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
} as const;

export const IntegrationStatus = {
  ACTIVE: 'active',
  ERROR: 'error',
  PAUSED: 'paused',
} as const;

// Form builder types
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'rating' | 'number' | 'url' | 'phone';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  conditional?: {
    field: string;
    value: string | string[];
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains';
  };
  description?: string;
  defaultValue?: string;
}

export interface FormStyling {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: number;
  logoUrl?: string;
  customCSS?: string;
  layout: 'single-column' | 'two-column';
  theme: 'light' | 'dark' | 'auto';
}

export interface FormSettings {
  redirectUrl?: string;
  thankYouMessage?: string;
  allowMultipleSubmissions: boolean;
  requireEmailVerification: boolean;
  enableSpamProtection: boolean;
  maxSubmissions?: number;
  expirationDate?: Date;
  enableAnalytics: boolean;
  notificationEmail?: string;
  autoApprove: boolean;
  collectIpAddress: boolean;
  enableFileUploads: boolean;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
}

export interface FormWithStats extends Form {
  submissionCount: number;
  conversionRate: number;
  averageCompletionTime: number;
  lastSubmissionAt?: Date;
}

export interface FormSubmissionWithData extends FormSubmission {
  form: {
    name: string;
    fields: FormField[];
  };
}

// Form builder field types
export const FormFieldTypes = {
  TEXT: 'text',
  EMAIL: 'email',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  FILE: 'file',
  RATING: 'rating',
  NUMBER: 'number',
  URL: 'url',
  PHONE: 'phone',
} as const;

export type FormFieldType = typeof FormFieldTypes[keyof typeof FormFieldTypes];

// Form templates
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: 'testimonial' | 'feedback' | 'survey' | 'contact';
  fields: FormField[];
  styling: Partial<FormStyling>;
  settings: Partial<FormSettings>;
  preview?: string;
}

// Form analytics
export interface FormAnalytics {
  formId: string;
  totalViews: number;
  totalSubmissions: number;
  conversionRate: number;
  averageCompletionTime: number;
  dropOffPoints: Array<{
    fieldId: string;
    fieldLabel: string;
    dropOffRate: number;
  }>;
  submissionsByDay: Array<{
    date: string;
    submissions: number;
    views: number;
  }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  trafficSources: Array<{
    source: string;
    visits: number;
    conversions: number;
  }>;
}
// Shared DTOs consumed by frontend, admin, and backend.
// Wire format: dates are serialized as ISO strings.

export const PROJECT_CATEGORIES = [
  'landing_page',
  'dashboard',
  'game',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** A project as returned by the API (dates are ISO strings). */
export interface ProjectDTO {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string | null;
  codeUrl: string | null;
  date: string; // ISO
  previewImageUrl: string[];
  category: ProjectCategory;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/** Payload to create a project (admin). */
export interface CreateProjectInput {
  title: string;
  slug?: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string | null;
  codeUrl?: string | null;
  date: string; // ISO or YYYY-MM-DD
  previewImageUrl?: string[];
  category: ProjectCategory;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
}

/** Payload to update a project (admin) — all fields optional. */
export type UpdateProjectInput = Partial<CreateProjectInput>;

export interface ReorderProjectsInput {
  order: Array<{ id: number; sortOrder: number }>;
}

export type ContactStatus = 'new' | 'read' | 'archived';

export interface ContactSubmissionDTO {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string; // ISO
}

/** Public contact form payload. `honeypot` should be empty for humans. */
export interface CreateContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface AdminMe {
  id: number;
  email: string;
}

/** Site owner's personal information (singleton). */
export interface PersonalInfoDTO {
  name: string;
  role: string;
  bio: string;
  phone: string;
  email: string;
  location: string;
  /** Year the owner started developing, e.g. "2018". */
  developerSince: string;
}

/** A single social link (e.g. github, linkedin). */
export interface SocialLinkDTO {
  url: string;
  label: string;
}

/** Social links keyed by platform. */
export type SocialLinksDTO = Record<string, SocialLinkDTO>;

/** A navigation item (anchor link to a page section). */
export interface NavItemDTO {
  name: string;
  href: string;
}

/** A skill with a proficiency level (0–100). */
export interface SkillDTO {
  name: string;
  level: number;
}

/** Aggregate of all site content served at GET /api/profile. */
export interface ProfileDTO {
  personalInfo: PersonalInfoDTO;
  socialLinks: SocialLinksDTO;
  navItems: NavItemDTO[];
  skills: SkillDTO[];
}

/** Standard API error envelope. */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

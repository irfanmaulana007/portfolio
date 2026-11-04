import { z } from 'zod';

export const projectCategorySchema = z.enum(['landing_page', 'dashboard', 'game']);

// Images are served by the frontend from its own `public/` dir and rendered with
// next/image, which rejects hosts that aren't in `images.remotePatterns`. So an
// image reference must be a site-relative path (`/images/...`), never an absolute
// URL — otherwise the page (and the production build) breaks.
// Must start with a single "/" — a protocol-relative "//host/x" is treated as a
// remote URL by next/image and would break the render/build just like an
// absolute URL, so the negative lookahead rejects a leading "//".
const relativeImagePath = z
  .string()
  .regex(/^\/(?!\/)[^\s]*$/, 'must be a site-relative path, e.g. /images/project/foo.webp');

// Links are rendered as `<a href>` on the public site — restrict to http(s) so a
// `javascript:`/`data:` URL can never become a stored script/phishing link.
const httpUrl = z
  .string()
  .url()
  .refine((u) => /^https?:\/\//i.test(u), 'must be an http(s) URL');

// Accepts ISO 8601 or YYYY-MM-DD; rejects garbage like "tomorrow" up front so it
// surfaces as a 400 rather than a 500 from `new Date(...)` downstream.
const dateString = z
  .string()
  .min(1)
  .refine((s) => !Number.isNaN(Date.parse(s)), 'must be a valid date');

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case')
    .optional(),
  description: z.string().min(1),
  image: relativeImagePath,
  tags: z.array(z.string()).default([]),
  demoUrl: httpUrl.nullish().or(z.literal('')),
  codeUrl: httpUrl.nullish().or(z.literal('')),
  date: dateString,
  previewImageUrl: z.array(relativeImagePath).default([]),
  category: projectCategorySchema,
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

// Coerce query-string pagination so `?page=abc` fails as a 400 rather than
// producing `NaN` and a 500 from Prisma `skip: NaN`.
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const reorderProjectsSchema = z.object({
  order: z
    .array(z.object({ id: z.number().int(), sortOrder: z.number().int() }))
    .min(1),
});

export const createContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  subject: z.string().min(1).max(300),
  message: z.string().min(1).max(5000),
  honeypot: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const contactStatusSchema = z.enum(['new', 'read', 'archived']);

export const updateContactSchema = z.object({
  status: contactStatusSchema,
});

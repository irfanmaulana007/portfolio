import { z } from 'zod';

export const projectCategorySchema = z.enum(['landing_page', 'dashboard', 'game']);

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case')
    .optional(),
  description: z.string().min(1),
  image: z.string().min(1),
  tags: z.array(z.string()).default([]),
  demoUrl: z.string().url().nullish().or(z.literal('')),
  codeUrl: z.string().url().nullish().or(z.literal('')),
  date: z.string().min(1), // ISO or YYYY-MM-DD
  previewImageUrl: z.array(z.string()).default([]),
  category: projectCategorySchema,
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
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

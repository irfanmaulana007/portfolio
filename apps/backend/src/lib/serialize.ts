import type { Project, ContactSubmission } from '@prisma/client';
import type { ProjectDTO, ContactSubmissionDTO } from '@portfolio/shared-types';

export function toProjectDTO(p: Project): ProjectDTO {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    image: p.image,
    tags: p.tags,
    demoUrl: p.demoUrl,
    codeUrl: p.codeUrl,
    date: p.date.toISOString(),
    previewImageUrl: p.previewImageUrl,
    category: p.category,
    featured: p.featured,
    published: p.published,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function toContactDTO(c: ContactSubmission): ContactSubmissionDTO {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    subject: c.subject,
    message: c.message,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  };
}

import type { Prisma, ProjectCategory } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeUrl(value: string | null | undefined): string | null {
  if (value === undefined || value === null || value === '') return null;
  return value;
}

interface ListPublishedOptions {
  category?: ProjectCategory;
  sort?: 'date' | 'order';
}

export async function listPublishedProjects(opts: ListPublishedOptions = {}) {
  const orderBy: Prisma.ProjectOrderByWithRelationInput =
    opts.sort === 'date' ? { date: 'desc' } : { sortOrder: 'asc' };
  return prisma.project.findMany({
    where: { published: true, ...(opts.category ? { category: opts.category } : {}) },
    orderBy,
  });
}

export async function getPublishedBySlug(slug: string) {
  const project = await prisma.project.findFirst({ where: { slug, published: true } });
  if (!project) throw new AppError(404, 'not_found', 'Project not found');
  return project;
}

interface AdminListOptions {
  category?: ProjectCategory;
  published?: boolean;
  featured?: boolean;
}

export async function listAllProjects(opts: AdminListOptions = {}) {
  return prisma.project.findMany({
    where: {
      ...(opts.category ? { category: opts.category } : {}),
      ...(opts.published !== undefined ? { published: opts.published } : {}),
      ...(opts.featured !== undefined ? { featured: opts.featured } : {}),
    },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getProjectById(id: number) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError(404, 'not_found', 'Project not found');
  return project;
}

type CreateData = {
  title: string;
  slug?: string;
  description: string;
  image: string;
  tags?: string[];
  demoUrl?: string | null;
  codeUrl?: string | null;
  date: string;
  previewImageUrl?: string[];
  category: ProjectCategory;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
};

export async function createProject(data: CreateData) {
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) throw new AppError(409, 'slug_taken', `Slug "${slug}" already exists`);

  return prisma.project.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      image: data.image,
      tags: data.tags ?? [],
      demoUrl: normalizeUrl(data.demoUrl),
      codeUrl: normalizeUrl(data.codeUrl),
      date: new Date(data.date),
      previewImageUrl: data.previewImageUrl ?? [],
      category: data.category,
      featured: data.featured ?? false,
      published: data.published ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateProject(id: number, data: Partial<CreateData>) {
  await getProjectById(id); // 404 if missing

  const patch: Prisma.ProjectUpdateInput = {};
  if (data.title !== undefined) patch.title = data.title;
  if (data.slug !== undefined) {
    const slug = slugify(data.slug);
    const clash = await prisma.project.findFirst({ where: { slug, id: { not: id } } });
    if (clash) throw new AppError(409, 'slug_taken', `Slug "${slug}" already exists`);
    patch.slug = slug;
  }
  if (data.description !== undefined) patch.description = data.description;
  if (data.image !== undefined) patch.image = data.image;
  if (data.tags !== undefined) patch.tags = data.tags;
  if (data.demoUrl !== undefined) patch.demoUrl = normalizeUrl(data.demoUrl);
  if (data.codeUrl !== undefined) patch.codeUrl = normalizeUrl(data.codeUrl);
  if (data.date !== undefined) patch.date = new Date(data.date);
  if (data.previewImageUrl !== undefined) patch.previewImageUrl = data.previewImageUrl;
  if (data.category !== undefined) patch.category = data.category;
  if (data.featured !== undefined) patch.featured = data.featured;
  if (data.published !== undefined) patch.published = data.published;
  if (data.sortOrder !== undefined) patch.sortOrder = data.sortOrder;

  return prisma.project.update({ where: { id }, data: patch });
}

export async function deleteProject(id: number) {
  await getProjectById(id);
  await prisma.project.delete({ where: { id } });
}

export async function reorderProjects(order: Array<{ id: number; sortOrder: number }>) {
  await prisma.$transaction(
    order.map((o) =>
      prisma.project.update({ where: { id: o.id }, data: { sortOrder: o.sortOrder } })
    )
  );
}

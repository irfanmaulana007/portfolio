import { Router } from 'express';
import type { ProjectCategory } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/error';
import {
  createProjectSchema,
  projectCategorySchema,
  reorderProjectsSchema,
  updateProjectSchema,
} from '../lib/validation';
import {
  createProject,
  deleteProject,
  getProjectById,
  listAllProjects,
  reorderProjects,
  updateProject,
} from '../services/project.service';
import { toProjectDTO } from '../lib/serialize';

export const adminProjectsRouter = Router();

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, 'bad_request', 'Invalid id');
  return id;
}

function parseBool(v: unknown): boolean | undefined {
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

adminProjectsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const categoryParsed = req.query.category
      ? projectCategorySchema.safeParse(req.query.category)
      : undefined;
    const category =
      categoryParsed && categoryParsed.success
        ? (categoryParsed.data as ProjectCategory)
        : undefined;

    const projects = await listAllProjects({
      category,
      published: parseBool(req.query.published),
      featured: parseBool(req.query.featured),
    });
    res.json(projects.map(toProjectDTO));
  })
);

// Bulk reorder must be declared before "/:id" so it is not captured by it.
adminProjectsRouter.patch(
  '/reorder',
  asyncHandler(async (req, res) => {
    const { order } = reorderProjectsSchema.parse(req.body);
    await reorderProjects(order);
    res.json({ ok: true });
  })
);

adminProjectsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createProjectSchema.parse(req.body);
    const project = await createProject(body);
    res.status(201).json(toProjectDTO(project));
  })
);

adminProjectsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const project = await getProjectById(parseId(req.params.id));
    res.json(toProjectDTO(project));
  })
);

adminProjectsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const body = updateProjectSchema.parse(req.body);
    const project = await updateProject(parseId(req.params.id), body);
    res.json(toProjectDTO(project));
  })
);

adminProjectsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await deleteProject(parseId(req.params.id));
    res.status(204).send();
  })
);

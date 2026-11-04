import { Router } from 'express';
import type { ProjectCategory } from '@prisma/client';
import { asyncHandler } from '../middleware/error';
import { projectCategorySchema } from '../lib/validation';
import { getPublishedBySlug, listPublishedProjects } from '../services/project.service';
import { toProjectDTO } from '../lib/serialize';

export const publicProjectsRouter = Router();

publicProjectsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const categoryParsed = req.query.category
      ? projectCategorySchema.safeParse(req.query.category)
      : undefined;
    const category =
      categoryParsed && categoryParsed.success
        ? (categoryParsed.data as ProjectCategory)
        : undefined;
    const sort = req.query.sort === 'date' ? 'date' : 'order';

    const projects = await listPublishedProjects({ category, sort });
    res.json(projects.map(toProjectDTO));
  })
);

publicProjectsRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const project = await getPublishedBySlug(req.params.slug);
    res.json(toProjectDTO(project));
  })
);

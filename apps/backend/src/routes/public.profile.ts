import { Router } from 'express';
import { asyncHandler } from '../middleware/error';
import { getProfileContent } from '../services/profile.service';
import { toProfileDTO } from '../lib/serialize';

export const publicProfileRouter = Router();

publicProfileRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const content = await getProfileContent();
    res.json(toProfileDTO(content));
  })
);

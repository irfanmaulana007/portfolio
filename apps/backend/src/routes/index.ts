import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { publicProjectsRouter } from './public.projects';
import { publicProfileRouter } from './public.profile';
import { contactRouter } from './contact';
import { authRouter } from './auth';
import { adminProjectsRouter } from './admin.projects';
import { adminContactsRouter } from './admin.contacts';

export const apiRouter = Router();

// Public (no auth)
apiRouter.use('/projects', publicProjectsRouter);
apiRouter.use('/profile', publicProfileRouter);
apiRouter.use('/contact', contactRouter);
apiRouter.use('/auth', authRouter);

// Admin (JWT required)
const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get('/me', (req, res) => {
  res.json({ id: req.admin?.sub, email: req.admin?.email });
});
adminRouter.use('/projects', adminProjectsRouter);
adminRouter.use('/contacts', adminContactsRouter);

apiRouter.use('/admin', adminRouter);

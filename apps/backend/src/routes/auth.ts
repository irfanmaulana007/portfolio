import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../middleware/error';
import { loginSchema } from '../lib/validation';
import { login } from '../services/auth.service';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'rate_limited', message: 'Too many attempts, try again later' } },
});

authRouter.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await login(email, password);
    res.json(result);
  })
);

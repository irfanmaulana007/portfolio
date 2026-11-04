import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../middleware/error';
import { createContactSchema } from '../lib/validation';
import { createContact } from '../services/contact.service';

export const contactRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'rate_limited', message: 'Too many submissions, try again later' } },
});

contactRouter.post(
  '/',
  contactLimiter,
  asyncHandler(async (req, res) => {
    const body = createContactSchema.parse(req.body);

    // Honeypot: bots fill hidden fields. Pretend success, store nothing.
    if (body.honeypot && body.honeypot.trim() !== '') {
      res.status(201).json({ id: 0, status: 'new' });
      return;
    }

    const contact = await createContact({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      ipAddress: req.ip ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    });

    res.status(201).json({ id: contact.id, status: contact.status });
  })
);

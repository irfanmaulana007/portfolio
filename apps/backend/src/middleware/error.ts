import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import * as Sentry from '@sentry/node';

export class AppError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: { code: 'not_found', message: 'Resource not found' } });
};

// Express error handler — must keep the 4-arg signature.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: { code: 'validation_error', message: 'Invalid request', details: err.flatten() },
    });
    return;
  }

  if (err instanceof AppError) {
    // AppError carries an explicit status. 4xx are controlled client responses
    // (auth, not-found, conflict) and must not reach Sentry; a 5xx AppError is a
    // real server fault worth reporting. (All current throws are 4xx.)
    if (err.status >= 500) Sentry.captureException(err);
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  // Map common Prisma errors for expected client mistakes so they don't become 500s:
  // P2002 = unique-constraint violation (e.g. a slug race), P2025 = record not found
  // (e.g. reorder/update of a deleted id).
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: { code: 'conflict', message: 'Resource already exists' } });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: { code: 'not_found', message: 'Resource not found' } });
      return;
    }
  }

  // Everything above was an expected, mapped response (4xx/409/404). Reaching
  // here means a genuine, unexpected server error — the only thing worth sending
  // to Sentry. captureException is a no-op when Sentry is not initialized.
  Sentry.captureException(err);
  console.error('[error]', err);
  res.status(500).json({ error: { code: 'internal_error', message: 'Something went wrong' } });
};

// Wrap async handlers so thrown errors reach the error middleware.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

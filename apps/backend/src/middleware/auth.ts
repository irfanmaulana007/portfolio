import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../lib/config';
import { AppError } from './error';

export interface AuthPayload {
  sub: number;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresInSeconds,
    algorithm: 'HS256',
  });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError(401, 'unauthorized', 'Missing bearer token');
  }
  const token = header.slice('Bearer '.length);
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    }) as unknown as AuthPayload;
    req.admin = { sub: decoded.sub, email: decoded.email };
    next();
  } catch {
    throw new AppError(401, 'unauthorized', 'Invalid or expired token');
  }
}

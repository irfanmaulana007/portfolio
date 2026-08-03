import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';
import { signToken } from '../middleware/auth';
import { config } from '../lib/config';

export async function login(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) throw new AppError(401, 'invalid_credentials', 'Invalid email or password');

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw new AppError(401, 'invalid_credentials', 'Invalid email or password');

  const token = signToken({ sub: admin.id, email: admin.email });
  return { token, expiresIn: config.jwtExpiresInSeconds };
}

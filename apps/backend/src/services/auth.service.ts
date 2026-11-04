import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';
import { signToken } from '../middleware/auth';
import { config } from '../lib/config';

// bcrypt cost factor — must match the cost used when hashing real admin
// passwords (see prisma/seed.ts) so the dummy comparison below takes the same
// time as a real one.
const BCRYPT_COST = 12;

// A bcrypt hash of a value no real password will match, computed once at startup
// (not stored as a literal in source). Compared against when the account doesn't
// exist so login takes ~the same time either way and can't be used to enumerate
// which emails are admins.
const DUMMY_HASH = bcrypt.hashSync('no-account-placeholder', BCRYPT_COST);

export async function login(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    // Spend the same time as a real comparison, then fail identically.
    await bcrypt.compare(password, DUMMY_HASH);
    throw new AppError(401, 'invalid_credentials', 'Invalid email or password');
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw new AppError(401, 'invalid_credentials', 'Invalid email or password');

  const token = signToken({ sub: admin.id, email: admin.email });
  return { token, expiresIn: config.jwtExpiresInSeconds };
}

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error';

/**
 * Load all public site content in one shot: the singleton profile plus the
 * ordered social links, nav items, and skills.
 */
export async function getProfileContent() {
  const [profile, socialLinks, navItems, skills] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: 1 } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.navItem.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  if (!profile) {
    throw new AppError(
      404,
      'not_found',
      'Site profile not found. Did you run the seed?'
    );
  }

  return { profile, socialLinks, navItems, skills };
}

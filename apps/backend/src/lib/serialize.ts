import type {
  Project,
  ContactSubmission,
  SiteProfile,
  SocialLink,
  NavItem,
  Skill,
} from '@prisma/client';
import type {
  ProjectDTO,
  ContactSubmissionDTO,
  ProfileDTO,
  PersonalInfoDTO,
  SocialLinksDTO,
} from '@portfolio/shared-types';

export function toProjectDTO(p: Project): ProjectDTO {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    image: p.image,
    tags: p.tags,
    demoUrl: p.demoUrl,
    codeUrl: p.codeUrl,
    date: p.date.toISOString(),
    previewImageUrl: p.previewImageUrl,
    category: p.category,
    featured: p.featured,
    published: p.published,
    sortOrder: p.sortOrder,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function toPersonalInfoDTO(p: SiteProfile): PersonalInfoDTO {
  return {
    name: p.name,
    role: p.role,
    bio: p.bio,
    phone: p.phone,
    email: p.email,
    location: p.location,
    developerSince: p.developerSince,
  };
}

export function toProfileDTO(input: {
  profile: SiteProfile;
  socialLinks: SocialLink[];
  navItems: NavItem[];
  skills: Skill[];
}): ProfileDTO {
  const socialLinks: SocialLinksDTO = {};
  for (const s of input.socialLinks) {
    socialLinks[s.platform] = { url: s.url, label: s.label };
  }
  return {
    personalInfo: toPersonalInfoDTO(input.profile),
    socialLinks,
    navItems: input.navItems.map((n) => ({ name: n.name, href: n.href })),
    skills: input.skills.map((s) => ({ name: s.name, level: s.level })),
  };
}

export function toContactDTO(c: ContactSubmission): ContactSubmissionDTO {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    subject: c.subject,
    message: c.message,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  };
}

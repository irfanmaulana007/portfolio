import { PrismaClient, ProjectCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Snapshot of the projects previously hardcoded in
// apps/frontend/lib/constants.ts. Kept verbatim so no content is lost on cutover.
const seedProjects = [
  {
    title: 'h5-games-platform',
    description:
      'A modern HTML5 gaming platform built with Next.js that offers a seamless gaming experience across devices. Features include user authentication, game categorization, leaderboards, and responsive gameplay optimized for both desktop and mobile users.',
    image: '/images/project/h5-game-platform.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    demoUrl: 'https://h5-games-platform.vercel.app/',
    codeUrl: 'https://github.com/irfanmaulana007/h5-games-platform',
    date: '2025-07-03',
    previewImageUrl: [] as string[],
    category: ProjectCategory.game,
    featured: false,
  },
  {
    title: 'Mahad Albilad',
    description:
      'A comprehensive website for an Islamic boarding school featuring course management, student registration, event calendars, and a resource library. The platform serves as both an informational portal for prospective students and a management tool for administrators.',
    image: '/images/project/mahad-albilad.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    demoUrl: 'https://mahad-albilad.or.id',
    codeUrl: 'https://github.com/irfanmaulana007/mahad-albilad-v5',
    date: '2024-01-01',
    previewImageUrl: [],
    category: ProjectCategory.landing_page,
    featured: false,
  },
  {
    title: 'CareGuard',
    description:
      'An advanced security management dashboard that enables real-time monitoring, incident reporting, and staff scheduling for security personnel. The system includes interactive maps, alert notifications, and comprehensive reporting tools to enhance security operations.',
    image: '/images/project/careguard-dashboard.webp',
    tags: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Shadcn UI',
      'TanStack Query',
      'Leaflet',
    ],
    demoUrl: '',
    codeUrl: '',
    date: '2025-03-01',
    previewImageUrl: ['/images/project/careguard-dashboard.webp'],
    category: ProjectCategory.dashboard,
    featured: false,
  },
  {
    title: 'CrazyOnes Official Game',
    description:
      'An interactive web-based game developed for the CrazyOnes brand, featuring engaging gameplay mechanics, character customization, and social sharing capabilities. The game incorporates brand elements while providing an entertaining experience that drives user engagement and brand awareness.',
    image: '/images/project/crazyones-official.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    demoUrl: 'https://crazyones.noctua.gg/',
    codeUrl: '',
    date: '2024-06-01',
    previewImageUrl: [],
    category: ProjectCategory.game,
    featured: true,
  },
  {
    title: 'Noctua Platform',
    description:
      'A web-based platform for Noctua, featuring engaging gameplay mechanics, character customization, and social sharing capabilities. The game incorporates brand elements while providing an entertaining experience that drives user engagement and brand awareness.',
    image: '/images/project/noctua-platform.webp',
    tags: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Shadcn UI',
      'TanStack Query',
    ],
    demoUrl: 'https://noctua.gg/',
    codeUrl: '',
    date: '2024-03-01',
    previewImageUrl: [],
    category: ProjectCategory.game,
    featured: true,
  },
  {
    title: 'Noctua SDK Dashboard',
    description:
      'A web-based dashboard for Noctua SDK, featuring engaging gameplay mechanics, character customization, and social sharing capabilities. The game incorporates brand elements while providing an entertaining experience that drives user engagement and brand awareness.',
    image: '/images/project/noctua-sdk-dashboard.webp',
    tags: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Shadcn UI',
      'Rechart',
      'TanStack Query',
    ],
    demoUrl: '',
    codeUrl: '',
    date: '2025-01-01',
    previewImageUrl: ['/images/project/noctua-sdk-dashboard.webp'],
    category: ProjectCategory.dashboard,
    featured: false,
  },
  {
    title: 'Sentra Games',
    description:
      'Sentra Gamers is a comprehensive gaming portal platform that serves as a one-stop destination for gamers. Our platform provides a wide range of services and features designed to enhance the gaming experience and build a vibrant gaming community.',
    image: '/images/project/sentra-gamers.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    demoUrl: 'https://sentra-games.vercel.app/',
    codeUrl: 'https://github.com/irfanmaulana007/sentra-games',
    date: '2025-07-06',
    previewImageUrl: [],
    category: ProjectCategory.game,
    featured: true,
  },
  {
    title: 'Muthia Maharani',
    description: 'Portofolio website for Muthia Maharani, a UI/UX Designer.',
    image: '/images/project/portofolio-muthia.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    demoUrl: 'https://muthiamhrni.com',
    codeUrl: '',
    date: '2025-09-27',
    previewImageUrl: [],
    category: ProjectCategory.landing_page,
    featured: true,
  },
  {
    title: 'Hiji 2 Tilu',
    description:
      'A training and retreat ground website — "Grounded in Nature, Growing in Unity." Built with Next.js and a Strapi CMS backend, with content-managed pages, nature-focused visuals, and smooth animated browsing.',
    image: '/images/project/hiji-2-tilu.webp',
    tags: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'Strapi CMS',
    ],
    demoUrl: '',
    codeUrl: '',
    date: '2025-09-25',
    previewImageUrl: ['/images/project/hiji-2-tilu.webp'],
    category: ProjectCategory.landing_page,
    featured: true,
  },
  {
    title: 'Gym Assistant',
    description:
      'A personal training companion for organizing workouts and tracking progressive overload. Group training into workout days, add exercises with target sets and reps, log the weight lifted each session, and watch your strength trend over time.',
    image: '/images/project/gym-assistant.webp',
    tags: ['React', 'Vite', 'TypeScript', 'Go', 'PostgreSQL'],
    demoUrl: '',
    codeUrl: 'https://github.com/irfanmaulana007/gym-assistant',
    date: '2026-09-09',
    previewImageUrl: ['/images/project/gym-assistant.webp'],
    category: ProjectCategory.dashboard,
    featured: false,
  },
  {
    title: 'Simagis',
    description:
      'A management information system dashboard for day-to-day operations — searchable data tables, barcode generation, Excel import/export, and interactive charts, with authenticated role-based access and reporting.',
    image: '/images/project/simagis.webp',
    tags: [
      'React',
      'Vite',
      'TypeScript',
      'TanStack Query',
      'Tailwind CSS',
      'Recharts',
    ],
    demoUrl: '',
    codeUrl: '',
    date: '2026-02-05',
    previewImageUrl: ['/images/project/simagis.webp'],
    category: ProjectCategory.dashboard,
    featured: true,
  },
  {
    title: 'Head Office Support System (HRIS)',
    description:
      'An enterprise HRIS and head-office support platform for a large government agency. Covers employee management, biometric attendance and check-in/out with single sign-on, document workflows, and operational dashboards — a Next.js web app backed by a Go API, PostgreSQL, and Kafka-based data sync.',
    image: '/images/project/hris-system.webp',
    tags: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'TanStack Query',
      'Go',
      'PostgreSQL',
    ],
    demoUrl: '',
    codeUrl: '',
    date: '2025-03-12',
    previewImageUrl: ['/images/project/hris-system.webp'],
    category: ProjectCategory.dashboard,
    featured: true,
  },
];

// NOTE: Site content (SiteProfile / SocialLink / NavItem / Skill) is NOT seeded
// here. It is inserted once by the data migration
// migrations/20261105000000_add_site_content (INSERT ... ON CONFLICT DO NOTHING),
// which runs automatically on `prisma migrate deploy`. Keeping it there (a single
// source of truth) avoids duplicating the snapshot in two places and guarantees
// the content lands on deploy without running this seed.

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn(
      '[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed.'
    );
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  // Create-only: re-running the seed (e.g. to restore content) must NOT reset
  // the password of an existing admin. Rotate passwords deliberately, not as a
  // seed side effect.
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });
  console.log(`[seed] admin user ready: ${email}`);
}

async function seedProjectsData() {
  // Newest first, matching the current public site ordering.
  const ordered = [...seedProjects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let count = 0;
  for (let i = 0; i < ordered.length; i++) {
    const p = ordered[i];
    const slug = slugify(p.title);
    await prisma.project.upsert({
      where: { slug },
      update: {},
      create: {
        title: p.title,
        slug,
        description: p.description,
        image: p.image,
        tags: p.tags,
        demoUrl: p.demoUrl ? p.demoUrl : null,
        codeUrl: p.codeUrl ? p.codeUrl : null,
        date: new Date(p.date),
        previewImageUrl: p.previewImageUrl,
        category: p.category,
        featured: p.featured,
        published: true,
        sortOrder: i,
      },
    });
    count++;
  }
  console.log(`[seed] projects ready: ${count}`);
}

async function main() {
  await seedAdmin();
  await seedProjectsData();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('[seed] failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

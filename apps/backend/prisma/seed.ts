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
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'TanStack Query'],
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
];

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
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
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
  .catch(async (e) => {
    console.error('[seed] failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

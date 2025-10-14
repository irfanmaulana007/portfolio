// Personal Information
export const personalInfo = {
  name: 'Irfan Maulana',
  role: 'Frontend Developer',
  bio: 'A passionate frontend developer with expertise in building modern web applications using React, Next.js, and Tailwind CSS.',
  phone: '+62 851-5879-0074',
  email: 'professional.irfanmaulana007@gmail.com',
  location: 'DKI Jakarta, Indonesia',
  be_developer_since: '2018',
};

// Social Media Links
export const socialLinks = {
  github: {
    url: 'https://github.com/irfanmaulana007',
    label: 'GitHub',
  },
  linkedin: {
    url: 'https://linkedin.com/in/irfanmaulana007',
    label: 'LinkedIn',
  },
  twitter: {
    url: 'https://twitter.com/irfanmaulana007',
    label: 'Twitter',
  },
  instagram: {
    url: 'https://instagram.com/irfanmaulana007',
    label: 'Instagram',
  },
};

export enum ProjectCategory {
  LandingPage = 'landing_page',
  Dashboard = 'dashboard',
  Game = 'game',
}

export const projects = [
  {
    id: 1,
    title: 'h5-games-platform',
    description:
      'A modern HTML5 gaming platform built with Next.js that offers a seamless gaming experience across devices. Features include user authentication, game categorization, leaderboards, and responsive gameplay optimized for both desktop and mobile users.',
    image: '/images/project/h5-game-platform.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    demoUrl: 'https://h5-games-platform.vercel.app/',
    codeUrl: 'https://github.com/irfanmaulana007/h5-games-platform',
    date: '2025-07-03',
    previewImageUrl: [],
    category: ProjectCategory.Game,
  },
  {
    id: 2,
    title: 'Mahad Albilad',
    description:
      'A comprehensive website for an Islamic boarding school featuring course management, student registration, event calendars, and a resource library. The platform serves as both an informational portal for prospective students and a management tool for administrators.',
    image: '/images/project/mahad-albilad.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    demoUrl: 'https://mahad-albilad.or.id',
    codeUrl: 'https://github.com/irfanmaulana007/mahad-albilad-v5',
    date: '2024-01-01',
    previewImageUrl: [],
    category: ProjectCategory.LandingPage,
  },
  {
    id: 3,
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
    category: ProjectCategory.Dashboard,
  },
  {
    id: 4,
    title: 'CrazyOnes Official Game',
    description:
      'An interactive web-based game developed for the CrazyOnes brand, featuring engaging gameplay mechanics, character customization, and social sharing capabilities. The game incorporates brand elements while providing an entertaining experience that drives user engagement and brand awareness.',
    image: '/images/project/crazyones-official.webp',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    demoUrl: 'https://crazyones.noctua.gg/',
    codeUrl: '',
    date: '2024-06-01',
    previewImageUrl: [],
    category: ProjectCategory.Game,
  },
  {
    id: 5,
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
    category: ProjectCategory.Game,
  },
  {
    id: 6,
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
    category: ProjectCategory.Dashboard,
  },
  {
    id: 7,
    title: 'Sentra Games',
    description:
      'Sentra Gamers is a comprehensive gaming portal platform that serves as a one-stop destination for gamers. Our platform provides a wide range of services and features designed to enhance the gaming experience and build a vibrant gaming community.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'],
    image: '/images/project/sentra-gamers.webp',
    demoUrl: 'https://sentra-games.vercel.app/',
    codeUrl: 'https://github.com/irfanmaulana007/sentra-games',
    date: '2025-07-06',
    previewImageUrl: [],
    category: ProjectCategory.Game,
  },
];

// Skills
export const skills = {
  languages: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
  frameworks: ['React', 'Next.js', 'Vue.js'],
  libraries: [
    'Tailwind CSS',
    'Styled Components',
    'Framer Motion',
    'Shadcn UI',
    'Ant Design',
  ],
  tools: ['Git', 'Webpack', 'Vite', 'Figma'],
  // Add more skill categories as needed
};

// Navigation Items
export const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
];

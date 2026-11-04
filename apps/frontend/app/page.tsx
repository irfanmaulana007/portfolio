import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import {
  ProjectsSection,
  type ProjectCardData,
} from '@/components/sections/projects-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ContactSection } from '@/components/sections/contact-section';
import { fetchProjects } from '@/lib/api';
import { projects as staticProjects } from '@/lib/constants';

// Fallback used when the backend API is unavailable, so the public site
// always renders a projects list.
const fallbackProjects: ProjectCardData[] = staticProjects.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  image: p.image,
  tags: p.tags,
  demoUrl: p.demoUrl || null,
  codeUrl: p.codeUrl || null,
  previewImageUrl: p.previewImageUrl,
  category: p.category,
  date: p.date,
}));

export default async function Home() {
  const apiProjects = await fetchProjects();
  const projects: ProjectCardData[] = apiProjects ?? fallbackProjects;

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection projects={projects} />
      <SkillsSection />
      <ContactSection />
    </>
  );
}

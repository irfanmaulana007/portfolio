import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import {
  ProjectsSection,
  type ProjectCardData,
} from '@/components/sections/projects-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ContactSection } from '@/components/sections/contact-section';
import { fetchProjects, fetchProfile } from '@/lib/api';

export default async function Home() {
  const [apiProjects, profile] = await Promise.all([
    fetchProjects(),
    fetchProfile(),
  ]);

  const projects: ProjectCardData[] = apiProjects ?? [];
  const personalInfo = profile?.personalInfo ?? null;
  const socialLinks = profile?.socialLinks ?? {};
  const skills = profile?.skills ?? [];

  return (
    <>
      <HeroSection projects={projects} />
      <AboutSection personalInfo={personalInfo} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <ContactSection personalInfo={personalInfo} socialLinks={socialLinks} />
    </>
  );
}

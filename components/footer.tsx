'use client';

import { personalInfo, socialLinks } from '@/lib/constants';
import Link from 'next/link';
import { Text } from './ui/text';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F0F0F0] dark:bg-[#181818] relative py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <Text size="lg">{personalInfo.name}</Text>
            <Text size="sm" variant="secondary">
              Front-End Engineer crafting exceptional digital experiences
            </Text>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-6 mb-4">
              <Link
                href={socialLinks.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Text size="md">GitHub</Text>
              </Link>
              <Link
                href={socialLinks.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Text size="md">LinkedIn</Text>
              </Link>
              <Link
                href={socialLinks.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Text size="md">Twitter</Text>
              </Link>
              <Link
                href={socialLinks.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Text size="md">Instagram</Text>
              </Link>
            </div>
            <Text size="caption" variant="secondary">
              © {currentYear} {personalInfo.name}. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </footer>
  );
}

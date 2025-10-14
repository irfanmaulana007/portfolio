'use client';

import { personalInfo, socialLinks } from '@/lib/constants';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F0F0F0] dark:bg-[#181818] relative py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <Link href="#home" className="text-xl font-semibold">
              {personalInfo.name}
            </Link>
            <p className="text-muted-foreground mt-2">
              Front-End Engineer crafting exceptional digital experiences
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-6 mb-4">
              <Link
                href={socialLinks.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <Link
                href={socialLinks.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href={socialLinks.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} {personalInfo.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import type { SocialLinksDTO } from '@portfolio/shared-types';
import Link from 'next/link';
import { Text } from './ui/text';

interface FooterProps {
  name: string;
  socialLinks: SocialLinksDTO;
}

export function Footer({ name, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    { key: 'github', label: 'GitHub' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'instagram', label: 'Instagram' },
  ];

  return (
    <footer className="bg-[#F0F0F0] dark:bg-[#181818] relative py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <Text size="lg">{name}</Text>
            <Text size="sm" variant="secondary">
              Front-End Engineer crafting exceptional digital experiences
            </Text>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-6 mb-4">
              {footerLinks.map(({ key, label }) => {
                const link = socialLinks[key];
                if (!link) return null;
                return (
                  <Link
                    key={key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Text size="md">{link.label || label}</Text>
                  </Link>
                );
              })}
            </div>
            <Text size="caption" variant="secondary">
              © {currentYear} {name}. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </footer>
  );
}

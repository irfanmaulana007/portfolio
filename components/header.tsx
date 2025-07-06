'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { navItems, personalInfo } from '@/lib/constants';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
      
      // Check which section is currently in view
      const sections = navItems.map(item => item.href.substring(1));
      
      // Find the section that is currently in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in view (with some buffer for better UX)
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        scrolled
          ? 'bg-background backdrop-blur-md border-b border-border py-3'
          : 'bg-transparent py-8 text-white border-b border-transparent',
          activeSection !== 'home' ? 'bg-white/80' : ''
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="#home" className={cn(
          "font-semibold transition-all duration-200 ease-in-out",
          scrolled ? "text-xl text-black" : "text-2xl text-white"
        )}>
          {personalInfo.name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors relative",
                  scrolled 
                    ? isActive 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                    : isActive 
                      ? "text-white font-medium" 
                      : "text-white/80 hover:text-white",
                  isActive && "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-crimson-600 "
                )}
              >
                {item.name}
              </Link>
            );
          })}
          <Button asChild className={cn(
            scrolled ? "" : "bg-white text-black hover:bg-white/90"
          )}>
            <Link href="#contact">Get in Touch</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={cn(
              "md:hidden",
              scrolled ? "" : "text-white hover:bg-white/20"
            )}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 mt-10">
              {navItems.map(item => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "transition-colors text-lg",
                      isActive 
                        ? "text-primary font-medium" 
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Button asChild className="mt-4">
                <Link href="#contact">Get in Touch</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

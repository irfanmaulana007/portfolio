'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section
      id="home"
      className="h-screen flex flex-col justify-center pt-20 relative bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/hero-background.webp")' }}
    >
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            <span className="text-neutral-50">Front-End Engineer</span> crafting
            exceptional digital experiences
          </h1>
          <p className="text-xl text-neutral-100 mb-8 max-w-2xl">
            I build modern, responsive, and user-friendly web applications using
            cutting-edge technologies like React, Next.js, and Tailwind CSS.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="text-white border-white hover:text-white hover:bg-white/20">
              <Link href="#projects">View My Work</Link>
            </Button>`  `
            <Button asChild variant="outline" size="lg" className="text-neutral-800 border-white hover:text-white hover:bg-white/20">
              <Link href="#contact">Contact Me</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-background/10 z-0"></div>
    </section>
  );
}

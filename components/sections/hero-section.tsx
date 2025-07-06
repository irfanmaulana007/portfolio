'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            <span className="text-crimson-600">Front-End </span>Engineer
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            crafting exceptional digital experiences
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="max-w-3xl"
        >
          <p className="text-xl text-neutral-100 mb-8 max-w-2xl">
            I build modern, responsive, and user-friendly web applications using
            cutting-edge technologies like React, Next.js, and Tailwind CSS.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="max-w-3xl"
        >
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="text-white border-white hover:text-white hover:bg-white/20"
            >
              <Link href="#projects">View My Work</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-neutral-800 border-white hover:text-white hover:bg-white/20"
            >
              <Link href="#contact">Contact Me</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-neutral-700/10 z-0"></div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => {
            document
              .getElementById('about')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-neutral-100 text-sm font-light tracking-widest mb-1">
            Explore My Universe
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ChevronDown className="h-5 w-5 text-white animate-breathing" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

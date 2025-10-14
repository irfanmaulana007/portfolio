'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Text } from '../ui/text';

export function HeroSection() {
  return (
    <section
      id="home"
      className="h-screen flex flex-col justify-center pt-20 relative bg-center"
    >
      <div className="container relative z-10 flex flex-col gap-y-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-2 max-h-16 max-w-16 aspect-square">
              <Avatar className="w-full h-full object-contain">
                <AvatarImage src="/images/me.webp" alt="Profile picture" />
                <AvatarFallback className="text-4xl">IM</AvatarFallback>
              </Avatar>
            </div>
            <Text size="heading-1" weight="bold" variant="brand">
              Front-End
            </Text>
            <Text size="heading-1" weight="bold" variant="primary">
              Engineer
            </Text>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-3xl"
        >
          <Text
            size="display-3"
            weight="extrabold"
            variant="primary"
            className="!leading-[1.1]"
          >
            Crafting Exceptional Digital Experience
          </Text>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="max-w-3xl mt-4"
        >
          <Text size="heading-5" weight="light" variant="secondary">
            I build modern, responsive, and user-friendly web applications using
            cutting-edge technologies like React, Next.js, and Tailwind CSS.
          </Text>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="max-w-3xl mt-6"
        >
          <Button
            asChild
            variant="primary-outline"
            size="lg"
            className="text-neutral-800 border-white hover:text-white hover:bg-white/20"
          >
            <Link href="#contact">Contact Me</Link>
          </Button>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-neutral-700/10 z-0"></div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <motion.div
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={() => {
            document
              .getElementById('about')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Text size="md" variant="brand">
            Explore My Universe
          </Text>
          <ChevronDown className="h-5 w-5 text-[#CA3142] animate-breathing" />
        </motion.div>
      </motion.div>
    </section>
  );
}

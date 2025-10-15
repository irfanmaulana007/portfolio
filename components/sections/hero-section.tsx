'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Text } from '../ui/text';
import { Card, CardContent } from '../ui/card';
import { projects } from '@/lib/constants';

export function HeroSection() {
  return (
    <section
      id="home"
      className="h-screen flex flex-col justify-center pt-20 relative bg-center"
    >
      <div className="container relative z-10 flex gap-x-4">
        <div className="flex flex-col gap-y-2 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-y-2 gap-x-4">
              <div className="flex items-center gap-2 max-w-12 max-h-12 md:max-h-16 md:max-w-16 aspect-square">
                <Avatar className="w-full h-full object-contain">
                  <AvatarImage src="/images/me.webp" alt="Profile picture" />
                  <AvatarFallback className="text-4xl">IM</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-x-4">
                <Text size="heading-1" weight="bold" variant="brand">
                  Front-End
                </Text>
                <Text size="heading-1" weight="bold" variant="primary">
                  Engineer
                </Text>
              </div>
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
              I build modern, responsive, and user-friendly web applications
              using cutting-edge technologies like React, Next.js, and Tailwind
              CSS.
            </Text>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="max-w-3xl mt-6"
          >
            <Button asChild variant="primary-outline" size="lg">
              <Link href="#contact">Contact Me</Link>
            </Button>
          </motion.div>
        </div>
        <div className="flex flex-col gap-y-4 w-1/4 hidden md:block">
          <Text size="heading-5" weight="semibold" variant="primary">
            Featured projects:
          </Text>
          <Card className="!bg-[#FFFFFF] !border-[#E5E5E5] dark:!bg-[#1E2029] dark:!border-[#35394D]">
            <CardContent className="p-6 space-y-4">
              {projects
                .filter(project => project.featured)
                .map(project => (
                  <div key={project.id}>
                    <Link href={project.demoUrl} target="_blank">
                      <Text
                        size="md"
                        variant="secondary"
                        className="transition-all duration-300 hover:!text-[#000000] dark:hover:!text-[#FFFFFF]"
                      >
                        {project.title}
                      </Text>
                    </Link>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>

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

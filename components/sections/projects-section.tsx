'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { projects } from '@/lib/constants';
import Image from 'next/image';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '../ui/text';

export enum ProjectCategory {
  All = 'all',
  LandingPage = 'landing_page',
  Dashboard = 'dashboard',
  Game = 'game',
}

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>(
    ProjectCategory.All
  );
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });
  const tabsRef = useRef<HTMLButtonElement[]>([]);

  const sortedProjectByNewest = projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredProjects =
    activeCategory === ProjectCategory.All
      ? sortedProjectByNewest
      : sortedProjectByNewest.filter(
          project => project.category === activeCategory
        );

  // Update the indicator position when active category changes or on component mount
  useEffect(() => {
    // Use a small timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const categoryIndex =
        Object.values(ProjectCategory).indexOf(activeCategory);
      const activeTab = tabsRef.current[categoryIndex];

      if (activeTab) {
        const { offsetLeft, offsetWidth } = activeTab;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <section
      id="projects"
      className="py-20 bg-[#FAFAFA] dark:bg-[#121212] relative"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <div className="border-l-[3px] border-[#CA3142] dark:border-[#CA3142] pl-4">
              <Text size="heading-3" weight="semibold">
                My Projects
              </Text>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 relative min-h-[42px]">
              <div
                className="hidden md:block absolute left-0 h-[34px] bg-[#FAFAFA] dark:bg-[#EB7A85]/10 rounded-sm transition-all duration-300 ease-out z-0"
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.width ? 1 : 0,
                }}
              />
              {Object.values(ProjectCategory).map((category, index) => (
                <Button
                  key={category}
                  ref={el => {
                    if (el) tabsRef.current[index] = el;
                  }}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'capitalize relative z-10 transition-colors duration-300 border bg-[#FAFAFA] border-[#E5E5E5] text-[#1A1A1A] hover:border-[#D94A5B] dark:bg-[#1E2029] dark:border-[#35394D] dark:text-[#E0E3F0] dark:hover:border-[#EB7A85]',
                    activeCategory === category &&
                      'bg-[#FAFAFA] border-[#D94A5B] text-[#D94A5B] dark:bg-[#EB7A85]/10 dark:border-[#EB7A85] dark:text-[#EB7A85]'
                  )}
                >
                  {category === ProjectCategory.All
                    ? 'All Projects'
                    : category.replaceAll('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full flex flex-col overflow-hidden border border-[#E5E5E5] dark:border-[#242424] bg-[#FAFAFA] dark:bg-[#181818] transition-all duration-300 hover:shadow-md">
                  <div className="py-8 px-2 bg-[#F0F0F0] dark:bg-[#242424]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      height={300}
                      width={600}
                      quality={100}
                      className="object-cover object-top"
                    />
                  </div>
                  <CardHeader className='py-3'>
                    <Text size="heading-5" weight="bold">
                      {project.title}
                    </Text>
                    <Text size="sm" className="line-clamp-2 pt-1">
                      {project.description}
                    </Text>
                  </CardHeader>
                  <CardContent className='py-3 border-t border-b border-[#E5E5E5] dark:border-[#242424]'>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="py-3">
                    <div className="flex gap-3 w-full">
                      <div className="flex-1">
                        {project.demoUrl ? (
                          <Link href={project.demoUrl} target="_blank">
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full"
                            >
                              Live Demo
                            </Button>
                          </Link>
                        ) : (
                          <PreviewImages images={project.previewImageUrl} />
                        )}
                      </div>

                      {project.codeUrl && (
                        <div className="flex-1">
                          <Link href={project.codeUrl} target="_blank">
                            <Button
                              variant="primary-outline"
                              size="sm"
                              className="w-full"
                            >
                              Source Code
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PreviewImages({ images }: { images: string[] }) {
  const [visible, setVisible] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        className="w-full"
        onClick={() => setVisible(true)}
      >
        Preview
      </Button>

      <PhotoSlider
        images={images.map(item => ({ src: item, key: item }))}
        visible={visible}
        onClose={() => setVisible(false)}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}

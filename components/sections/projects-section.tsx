'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { projects } from '@/lib/constants';
import Image from 'next/image';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
    <section id="projects" className="py-20 bg-secondary/40">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">My Projects</h2>
            <p className="text-muted-foreground">Showcasing my recent work</p>
            <Separator className="my-4" />

            <div className="flex flex-wrap gap-2 pt-4 justify-center relative min-h-[42px]">
              <div
                className="hidden md:block absolute left-0 h-[34px] bg-primary rounded-sm transition-all duration-300 ease-out z-0"
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
                    'capitalize relative z-10 transition-colors duration-300 hover:bg-black hover:text-white md:hover:bg-transparent md:hover:text-initial',
                    activeCategory === category &&
                      'text-white bg-black md:bg-transparent'
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
                <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-border transition-all duration-300 hover:shadow-md">
                  <Image
                    src={project.image}
                    alt={project.title}
                    height={300}
                    width={600}
                    quality={100}
                    className="object-cover object-top"
                  />
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2 pt-1">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                  <CardFooter className="mt-auto">
                    <div className="flex gap-3 w-full">
                      <div className="flex-1">
                        {project.demoUrl ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full"
                          >
                            <Link href={project.demoUrl} target="_blank">
                              Live Demo
                            </Link>
                          </Button>
                        ) : (
                          <PreviewImages images={project.previewImageUrl} />
                        )}
                      </div>

                      {project.codeUrl && (
                        <div className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Link href={project.codeUrl} target="_blank">
                              Source Code
                            </Link>
                          </Button>
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
        variant="default"
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

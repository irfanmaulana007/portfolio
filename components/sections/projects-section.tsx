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

export function ProjectsSection() {
  const sortedProjectByNewest = projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  console.log('sortedProjectByNewest: ', sortedProjectByNewest);

  return (
    <section id="projects" className="py-20 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">My Projects</h2>
            <p className="text-muted-foreground">Showcasing my recent work</p>
            <Separator className="my-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjectByNewest.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
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
                    <CardDescription className="line-clamp-2">
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
                  <CardFooter className="mt-auto pt-4">
                    <div className="flex gap-3 w-full">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        disabled={
                          !project.demoUrl && !project.previewImageUrl.length
                        }
                      >
                        {project.demoUrl ? (
                          <Link href={project.demoUrl} target="_blank">
                            Live Demo
                          </Link>
                        ) : (
                          'Preview'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={!project.codeUrl}
                      >
                        <Link href={project.codeUrl} target="_blank">
                          Source Code
                        </Link>
                      </Button>
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

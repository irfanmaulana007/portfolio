'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { personalInfo } from '@/lib/constants';
import { differenceInYears } from 'date-fns';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#F0F0F0] dark:bg-[#181818] relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">About Me</h2>
            <p className="text-muted-foreground">Get to know me better</p>
            <Separator className="my-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 flex justify-center md:justify-start">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 max-h-52 max-w-52 aspect-square">
                  <Avatar className="w-full h-full object-contain">
                    <AvatarImage src="/images/me.webp" alt="Profile picture" />
                    <AvatarFallback className="text-4xl">IM</AvatarFallback>
                  </Avatar>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://github-readme-stats.vercel.app/api?username=irfanmaulana007&show_icons=true"
                  alt="Profile picture"
                  className="w-full max-w-52 object-contain"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-6">
              <p className="text-lg">
                I&apos;m a passionate Front-End Engineer with a strong focus on
                creating intuitive and performant user interfaces. With
                expertise in modern JavaScript frameworks and libraries, I
                specialize in building responsive web applications that deliver
                exceptional user experiences.
              </p>

              <p className="text-lg">
                My journey in software engineering has equipped me with a deep
                understanding of web technologies and best practices. I&apos;m
                constantly learning and adapting to new tools and methodologies
                to stay at the forefront of front-end development.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4">
                    <p className="font-medium">Name</p>
                    <p className="text-muted-foreground">{personalInfo.name}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      {personalInfo.email}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      {personalInfo.location}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="font-medium">Experience</p>
                    <p className="text-muted-foreground">
                      {differenceInYears(
                        new Date(),
                        new Date(personalInfo.be_developer_since)
                      )}
                      + Years
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

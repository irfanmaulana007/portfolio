'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { personalInfo } from '@/lib/constants';
import { differenceInYears } from 'date-fns';
import { Text } from '../ui/text';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';
import { useTheme } from '@/lib/hooks/use-theme';

export function AboutSection() {
  const { isDark } = useTheme();

  return (
    <section
      id="about"
      className="py-20 bg-[#F0F0F0] dark:bg-[#181818] relative"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          <div className="border-l-[3px] border-[#CA3142] dark:border-[#CA3142] pl-4">
            <Text size="heading-3" weight="semibold">
              About Me
            </Text>
          </div>

          <div className="flex flex-col gap-y-8">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 relative z-10">
                <Text size="display-1" weight="extrabold">
                  Irfan Maulana
                </Text>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <div className="max-h-56 max-w-56 aspect-square">
                  <Avatar className="w-full h-full object-contain rounded-md">
                    <AvatarImage src="/images/me.webp" alt="Profile picture" />
                    <AvatarFallback className="text-4xl">IM</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex flex-col justify-between h-full">
                  <Text size="lg">
                    I&apos;m a passionate Front-End Engineer with a strong focus
                    on creating intuitive and performant user interfaces. With
                    expertise in modern JavaScript frameworks and libraries, I
                    specialize in building responsive web applications that
                    deliver exceptional user experiences.
                  </Text>

                  <Text size="lg">
                    My journey in software engineering has equipped me with a
                    deep understanding of web technologies and best practices.
                    I&apos;m constantly learning and adapting to new tools and
                    methodologies to stay at the forefront of front-end
                    development.
                  </Text>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-6">
                <div className="h-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="h-full p-4 space-y-2">
                      <MapPin className="w-5 h-5 text-[#555555] dark:text-[#AAAAAA]" />
                      <Text size="sm" variant="secondary">
                        {personalInfo.location}
                      </Text>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="h-full p-4 space-y-2">
                      <Calendar className="w-5 h-5 text-[#555555] dark:text-[#AAAAAA]" />
                      <Text size="sm" variant="secondary">
                        {differenceInYears(
                          new Date(),
                          new Date(personalInfo.be_developer_since)
                        )}
                        + Years
                      </Text>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="h-full p-4 space-y-2">
                      <Phone className="w-5 h-5 text-[#555555] dark:text-[#AAAAAA]" />
                      <Text size="sm" variant="secondary">
                        {personalInfo.phone}
                      </Text>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="h-full p-4 space-y-2">
                      <Mail className="w-5 h-5 text-[#555555] dark:text-[#AAAAAA]" />
                      <Text size="sm" variant="secondary">
                        {personalInfo.email}
                      </Text>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="col-span-4">
                <picture>
                  {isDark ? (
                    <source srcSet="https://github-readme-stats.vercel.app/api?username=irfanmaulana007&border_color=242424&bg_color=1E1E1E&title_color=CA3142&text_color=AAAAAA&ring_color=CA3142&text_bold=false&border_radius=12" />
                  ) : (
                    <source srcSet="https://github-readme-stats.vercel.app/api?username=irfanmaulana007&border_color=E5E5E5&bg_colorFAFAFA&title_color=CA3142&text_color=555555&ring_color=CA3142&text_bold=false&border_radius=12" />
                  )}
                  <img
                    src="https://github-readme-stats.vercel.app/api?username=irfanmaulana007&show_icons=true"
                    alt="Profile picture"
                    className="w-full max-w-52 object-contain"
                  />
                </picture>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

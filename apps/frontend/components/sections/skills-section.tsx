'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { SkillDTO } from '@portfolio/shared-types';
import { Text } from '../ui/text';

export function SkillsSection({ skills }: { skills: SkillDTO[] }) {
  return (
    <section
      id="skills"
      className="py-20 bg-[#FAFAFA] dark:bg-[#121212] relative"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <Text size="heading-3" weight="semibold" align="center">
            Tools & Skills
          </Text>

          <div className="flex flex-wrap gap-2 justify-center max-w-5xl mx-auto">
            {skills.map(skill => (
              <Card
                key={skill.name}
                className="overflow-hidden !bg-[#FFFFFF] !border-[#E5E5E5] dark:!bg-[#1E2029] dark:!border-[#35394D] rounded-full"
              >
                <CardContent className="py-2 px-6">
                  <Text size="md" variant="secondary">
                    {skill.name}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

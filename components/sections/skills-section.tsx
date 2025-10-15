'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Text } from '../ui/text';

const skillCategories = [
  { name: 'HTML5', level: 95 },
  { name: 'CSS3/SCSS', level: 90 },
  { name: 'JavaScript (ES6+)', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'React.js', level: 90 },
  { name: 'Next.js', level: 85 },
  { name: 'Tailwind CSS', level: 90 },
  { name: 'Framer Motion', level: 75 },
  { name: 'Git/GitHub', level: 85 },
  { name: 'Figma', level: 80 },
  { name: 'Responsive Design', level: 95 },
  { name: 'Performance Optimization', level: 90 },
  { name: 'Accessibility (a11y)', level: 85 },
  { name: 'SEO Basics', level: 75 },
  { name: 'Testing (Jest, RTL)', level: 70 },
  { name: 'CI/CD', level: 65 },
];

export function SkillsSection() {
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
            {skillCategories.map(skill => (
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

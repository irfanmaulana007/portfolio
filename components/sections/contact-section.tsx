'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { personalInfo, socialLinks } from '@/lib/constants';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Text } from '../ui/text';
import { useState } from 'react';

export function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSendMessage = () => {
    const body = `Hi ${personalInfo.name},
    
${form.message}

Best regards,
${form.name}`;

    window.open(
      `mailto:${personalInfo.email}?subject=${form.subject}&body=${body.replace(
        /\n/g,
        '%0A'
      )}`,
      '_blank'
    );
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="!bg-[#CA31421A] !border-[#CA314266] dark:!bg-[#2E2E2E1A] dark:!border-[#2E2E2E66]">
              <CardContent className="px-6 py-10">
                <Text size="heading-2" weight="bold">
                  Ready to bring your web ideas to life?
                </Text>
                <form className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={e =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={form.email}
                        onChange={e =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What is your project about?"
                      value={form.subject}
                      onChange={e =>
                        setForm({ ...form, subject: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      rows={5}
                      value={form.message}
                      onChange={e =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSendMessage}
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="!bg-transparent !border-none">
              <CardContent className="p-6">
                <Text size="heading-5" weight="light">
                  Let&apos;s work together
                </Text>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#F5F5F5] dark:bg-[#242424] rounded-sm">
                      <MapPin className="w-5 h-5 text-[#CA3142]" />
                    </div>
                    <div>
                      <Text size="caption" variant="secondary">
                        Location
                      </Text>
                      <Text size="md">{personalInfo.location}</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#F5F5F5] dark:bg-[#242424] rounded-sm">
                      <Mail className="w-5 h-5 text-[#CA3142]" />
                    </div>
                    <div className="break-all">
                      <Text size="caption" variant="secondary">
                        Email
                      </Text>
                      <Text size="md">{personalInfo.email}</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#F5F5F5] dark:bg-[#242424] rounded-sm">
                      <Phone className="w-5 h-5 text-[#CA3142]" />
                    </div>
                    <div>
                      <Text size="caption" variant="secondary">
                        Phone
                      </Text>
                      <Text size="md">{personalInfo.phone}</Text>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Text size="heading-5" weight="light">
                    Connect with me
                  </Text>
                  <div className="flex gap-4 mt-4 text-[#CA3142]">
                    <a
                      href={socialLinks.github.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#F5F5F5] dark:bg-[#242424] rounded-sm hover:bg-[#CA3142]/10 transition-colors"
                      aria-label={socialLinks.github.label}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                    <a
                      href={socialLinks.linkedin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#F5F5F5] dark:bg-[#242424] rounded-sm hover:bg-[#CA3142]/10 transition-colors"
                      aria-label={socialLinks.linkedin.label}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    <a
                      href={socialLinks.twitter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#F5F5F5] dark:bg-[#242424] rounded-sm hover:bg-[#CA3142]/10 transition-colors"
                      aria-label={socialLinks.twitter.label}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                    <a
                      href={socialLinks.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#F5F5F5] dark:bg-[#242424] rounded-sm hover:bg-[#CA3142]/10 transition-colors"
                      aria-label={socialLinks.instagram.label}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

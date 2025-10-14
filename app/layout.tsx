import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Image from 'next/image';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Frontend Engineer Portfolio',
  description:
    'A minimalist portfolio showcasing frontend engineering skills and projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} min-h-screen bg-[#FAFAFA] dark:bg-[#121212] antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main className="relative">
            <div className="fixed inset-0">
              <Image
                src="/images/background.webp"
                alt="Background"
                fill
                className="object-cover"
              />
            </div>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import Navigation from '@/components/navigation';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MLShelf - Collaborate. Share. Discover ML.',
  description: 'An open, collaborative platform to host, share, discover, and deploy machine learning models and datasets.',
  keywords: ['machine learning', 'AI', 'models', 'datasets', 'collaboration', 'open source'],
  authors: [{ name: 'MLShelf Team' }],
  openGraph: {
    title: 'MLShelf - Collaborate. Share. Discover ML.',
    description: 'An open, collaborative platform to host, share, discover, and deploy machine learning models and datasets.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="font-body antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
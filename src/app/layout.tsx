import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'EngiTrack - Weekly Calendar Tracker',
  description: 'A mobile-first web app for tracking a Mechanical Engineering board exam routine.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

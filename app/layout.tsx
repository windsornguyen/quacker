import './globals.scss';
import { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Quacker',
  description: 'Quad Capacity Tracker',
  manifest: 'manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en' className={`antialiased ${geist.className}`}>
      <body>{children}</body>
    </html>
  );
}

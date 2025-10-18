import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Context0 Tool Playbook',
  description:
    'Explore the seven Context0 tools with mnemonics, best practices, and animated guides for every workflow.',
  openGraph: {
    title: 'Context0 Tool Playbook',
    description:
      'Explore the seven Context0 tools with mnemonics, best practices, and animated guides for every workflow.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Context0 Tool Playbook',
    description:
      'Explore the seven Context0 tools with mnemonics, best practices, and animated guides for every workflow.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

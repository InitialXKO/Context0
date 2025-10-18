import './globals.css';

export const metadata = {
  title: 'Learning Progress Dashboard',
  description: 'Track practice sessions and study milestones.',
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

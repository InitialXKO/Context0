import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Context0 智慧学习平台',
  description:
    '混合式学习平台，连接救急、提分与教学场景，为教育机构提供温暖而高效的数字化体验。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}

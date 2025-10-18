import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '速成法写作实验室',
  description: '围绕四个计时步骤的速成法写作模块，帮助快速搭建文章骨架。'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: '"Inter", "PingFang SC", "Microsoft YaHei", sans-serif', background: '#020617' }}>
        {children}
      </body>
    </html>
  );
}

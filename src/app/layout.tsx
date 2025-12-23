import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '电子礼簿系统',
  description: '纯本地、零后端、安全的礼金管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

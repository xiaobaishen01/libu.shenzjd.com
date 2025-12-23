'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 防止重复跳转
    if (typeof window === 'undefined') return;

    // 检查是否已经跳转过（避免循环）
    const hasRedirected = sessionStorage.getItem('has_redirected');
    if (hasRedirected) {
      // 已经跳转过，直接进入主界面或设置
      const events = JSON.parse(localStorage.getItem('giftlist_events') || '[]');
      if (events.length > 0) {
        router.replace('/main');
      } else {
        router.replace('/setup');
      }
      return;
    }

    // 第一次访问
    const events = JSON.parse(localStorage.getItem('giftlist_events') || '[]');

    if (events.length > 0) {
      sessionStorage.setItem('has_redirected', 'true');
      router.replace('/main');
    } else {
      sessionStorage.setItem('has_redirected', 'true');
      router.replace('/setup');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">电子礼簿系统</h1>
        <p className="text-gray-600">正在初始化...</p>
      </div>
    </div>
  );
}

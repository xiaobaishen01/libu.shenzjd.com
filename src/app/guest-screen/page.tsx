'use client';

import { useEffect, useState } from 'react';
import { GiftData } from '@/types';
import { Utils } from '@/lib/utils';

export default function GuestScreen() {
  const [data, setData] = useState<{
    eventName: string;
    theme: string;
    gifts: GiftData[];
  } | null>(null);

  useEffect(() => {
    // 轮询读取 localStorage
    const interval = setInterval(() => {
      const stored = localStorage.getItem('guest_screen_data');
      if (stored) {
        setData(JSON.parse(stored));
      }
    }, 1000);

    // 监听 postMessage
    window.addEventListener('message', (e) => {
      if (e.data.type === 'guest_screen_update') {
        setData(e.data.data);
      }
    });

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">等待主屏数据...</h1>
          <p className="text-gray-600">请确保主屏已打开并录入数据</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        data.theme === 'theme-festive' ? 'bg-red-50' : 'bg-gray-200'
      } p-8`}
    >
      {/* 控制栏 */}
      <div className="fixed top-4 right-4 flex gap-2 no-print">
        <button
          onClick={() => document.documentElement.requestFullscreen()}
          className="px-3 py-1 bg-black/50 text-white rounded text-sm"
        >
          全屏
        </button>
      </div>

      {/* 标题 */}
      <h1 className="text-4xl font-bold text-center mb-8 text-red-700 font-kaiti">
        {data.eventName}
      </h1>

      {/* 礼簿表格 */}
      <div className="max-w-5xl mx-auto border-8 border-red-600 rounded-2xl p-6 bg-white">
        {/* 表头 */}
        <div className="grid grid-cols-3 border-b-4 border-red-600 mb-4 pb-2 text-center text-xl font-bold text-red-700">
          <div>姓名</div>
          <div>类型</div>
          <div>金额</div>
        </div>

        {/* 数据行 */}
        <div className="space-y-2">
          {data.gifts.map((gift, idx) => {
            const isLatest = idx === data.gifts.length - 1;
            return (
              <div
                key={gift.timestamp}
                className={`
                  grid grid-cols-3 text-center py-4 border-b border-red-200
                  ${isLatest ? 'bg-yellow-100 animate-pulse' : ''}
                `}
              >
                <div className="font-kaiti text-2xl font-bold">
                  {gift.name.length === 2
                    ? `${gift.name[0]}　${gift.name[1]}`
                    : gift.name}
                </div>
                <div className="text-red-600 font-bold text-xl">{gift.type}</div>
                <div className="text-gray-800">
                  <div className="font-kaiti text-xl">
                    {Utils.amountToChinese(gift.amount)}
                  </div>
                  <div className="text-sm text-gray-500">¥{gift.amount}</div>
                </div>
              </div>
            );
          })}
        </div>

        {data.gifts.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-xl">暂无记录</div>
        )}
      </div>

      {/* 底部统计 */}
      <div className="text-center mt-8 text-gray-600">
        总计 {data.gifts.length} 人 | 总金额 ¥
        {data.gifts.reduce((sum, g) => sum + g.amount, 0).toFixed(2)}
      </div>
    </div>
  );
}

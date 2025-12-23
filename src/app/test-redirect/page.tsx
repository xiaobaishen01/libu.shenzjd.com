'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestRedirect() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    addLog('页面加载');

    const interval = setInterval(() => {
      addLog('检查中...');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const checkStorage = () => {
    const events = JSON.parse(localStorage.getItem('giftlist_events') || '[]');
    const session = sessionStorage.getItem('currentEvent');
    const redirect = sessionStorage.getItem('has_redirected');

    addLog(`Events: ${events.length}`);
    addLog(`Session: ${session ? '存在' : '不存在'}`);
    addLog(`Redirect标记: ${redirect || '无'}`);
  };

  const clearAll = () => {
    localStorage.clear();
    sessionStorage.clear();
    addLog('已清除所有存储');
  };

  const goHome = () => {
    addLog('跳转到首页...');
    router.push('/');
  };

  const goMain = () => {
    addLog('跳转到主界面...');
    router.push('/main');
  };

  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">路由跳转测试</h1>

      <div className="space-y-2 mb-6">
        <button onClick={checkStorage} className="px-4 py-2 bg-blue-500 text-white rounded">
          检查存储状态
        </button>
        <button onClick={clearAll} className="px-4 py-2 bg-red-500 text-white rounded">
          清除所有数据
        </button>
        <button onClick={goHome} className="px-4 py-2 bg-green-500 text-white rounded">
          跳转首页
        </button>
        <button onClick={goMain} className="px-4 py-2 bg-purple-500 text-white rounded">
          跳转主界面
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
        <div className="font-bold mb-2">日志：</div>
        {logs.map((log, i) => (
          <div key={i} className="border-b border-gray-300 py-1">{log}</div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h3 className="font-bold mb-2">使用说明：</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>点击"清除所有数据"重置状态</li>
          <li>点击"跳转首页"测试跳转逻辑</li>
          <li>观察日志和实际跳转行为</li>
          <li>手动访问 /test-redirect 也应正常</li>
        </ol>
      </div>
    </div>
  );
}

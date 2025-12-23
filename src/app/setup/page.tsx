'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CryptoService } from '@/lib/crypto';
import { Utils } from '@/lib/utils';
import { Event } from '@/types';
import { GitHubService } from '@/lib/github';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: Utils.getCurrentDateTime().date,
    startTime: '18:00',
    endDate: Utils.getCurrentDateTime().date,
    endTime: '22:00',
    password: '',
    theme: 'festive' as const,
    recorder: '',
    githubSync: false,
    githubOwner: '',
    githubRepo: '',
    githubToken: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const event: Event = {
        id: Utils.generateId(),
        name: formData.name,
        startDateTime: `${formData.startDate}T${formData.startTime}`,
        endDateTime: `${formData.endDate}T${formData.endTime}`,
        passwordHash: CryptoService.hash(formData.password),
        theme: formData.theme,
        recorder: formData.recorder,
        createdAt: new Date().toISOString(),
      };

      // 保存到 localStorage
      const events = JSON.parse(localStorage.getItem('giftlist_events') || '[]');
      events.push(event);
      localStorage.setItem('giftlist_events', JSON.stringify(events));

      // 保存 GitHub 配置（如果有）
      if (formData.githubSync) {
        const githubConfig = {
          owner: formData.githubOwner,
          repo: formData.githubRepo,
          token: formData.githubToken,
        };
        localStorage.setItem('giftlist_github', JSON.stringify(githubConfig));

        // 测试连接
        const github = new GitHubService(githubConfig);
        const connected = await github.testConnection();
        if (!connected) {
          alert('GitHub 连接失败，将只使用本地存储');
          localStorage.removeItem('giftlist_github');
        } else {
          // 初始化仓库数据
          await github.syncEvents(events);
        }
      }

      // 保存会话
      sessionStorage.setItem(
        'currentEvent',
        JSON.stringify({
          event,
          password: formData.password,
          timestamp: Date.now(),
        })
      );

      // 重置首页跳转标记，允许重新选择
      sessionStorage.removeItem('has_redirected');

      router.replace('/main');
    } catch (err) {
      console.error(err);
      alert('创建失败: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          创建新事项
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">事项名称</label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="张三李四新婚之喜"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">管理密码</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="请牢记，丢失无法找回"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">开始时间</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-1/2 p-2 border rounded"
                  />
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-1/2 p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">结束时间</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-1/2 p-2 border rounded"
                  />
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-1/2 p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">界面主题</label>
                <select
                  value={formData.theme}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      theme: e.target.value as 'festive' | 'solemn',
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="festive">喜庆红 (喜事)</option>
                  <option value="solemn">肃穆灰 (白事)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  记账人 (选填)
                </label>
                <input
                  value={formData.recorder}
                  onChange={(e) =>
                    setFormData({ ...formData, recorder: e.target.value })
                  }
                  placeholder="王五"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* GitHub 同步（可选） */}
          <div className="border-t pt-6">
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.githubSync}
                onChange={(e) =>
                  setFormData({ ...formData, githubSync: e.target.checked })
                }
              />
              <span className="font-medium">启用 GitHub 云端同步</span>
            </label>

            {formData.githubSync && (
              <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  数据将加密存储在你的 GitHub 仓库中，支持多设备同步
                </p>
                <input
                  required={formData.githubSync}
                  placeholder="GitHub 用户名 (owner)"
                  value={formData.githubOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, githubOwner: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  required={formData.githubSync}
                  placeholder="仓库名 (repo)"
                  value={formData.githubRepo}
                  onChange={(e) =>
                    setFormData({ ...formData, githubRepo: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  required={formData.githubSync}
                  type="password"
                  placeholder="Personal Access Token (PAT)"
                  value={formData.githubToken}
                  onChange={(e) =>
                    setFormData({ ...formData, githubToken: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-gray-600">
                  需要 repo 权限。数据将保存在 data/ 目录下。
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '创建中...' : '创建并进入'}
          </button>
        </form>
      </div>
    </div>
  );
}

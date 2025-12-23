import { GitHubConfig } from '@/types';

export class GitHubService {
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private async request(path: string, method: string = 'GET', body?: any): Promise<any> {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // 测试连接
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`,
        {
          headers: { 'Authorization': `token ${this.config.token}` },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  // 读取文件
  async readFile(path: string): Promise<string | null> {
    try {
      const data = await this.request(path);
      return atob(data.content);
    } catch {
      return null;
    }
  }

  // 写入文件
  async writeFile(path: string, content: string, message: string): Promise<void> {
    try {
      const existing = await this.readFile(path).catch(() => null);
      const body: any = {
        message,
        content: btoa(unescape(encodeURIComponent(content))),
      };

      if (existing) {
        const fileData = await this.request(path);
        body.sha = fileData.sha;
      }

      await this.request(path, 'PUT', body);
    } catch (error) {
      console.error('GitHub write failed:', error);
      throw error;
    }
  }

  // 同步事件
  async syncEvents(events: any[]): Promise<void> {
    await this.writeFile('data/events.json', JSON.stringify(events, null, 2), 'Update events');
  }

  // 同步礼金
  async syncGifts(eventId: string, gifts: any[]): Promise<void> {
    await this.writeFile(`data/gifts/${eventId}.json`, JSON.stringify(gifts, null, 2), `Update gifts for ${eventId}`);
  }
}

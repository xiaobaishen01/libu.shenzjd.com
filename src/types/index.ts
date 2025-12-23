// 事项类型
export interface Event {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  passwordHash: string;
  theme: 'festive' | 'solemn';
  recorder?: string;
  createdAt: string;
}

// 礼金数据（解密后）
export interface GiftData {
  name: string;
  amount: number;
  type: '现金' | '微信' | '支付宝' | '其他';
  remark?: string;
  timestamp: string;
  abolished?: boolean;
}

// 礼金记录（加密存储）
export interface GiftRecord {
  id: string;
  eventId: string;
  encryptedData: string;
}

// GitHub 配置
export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
}

// 存储配置
export interface StorageConfig {
  type: 'local' | 'github';
  github?: GitHubConfig;
}

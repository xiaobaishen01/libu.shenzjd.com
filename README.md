# 🎁 电子礼簿系统

基于 **Next.js 15** 的现代化电子礼簿系统，支持本地存储和 GitHub 云端同步。

## ✨ 核心特性

| 功能 | 描述 |
|------|------|
| 📦 **双存储** | localStorage (默认) + GitHub 云端 (可选) |
| 🔒 **数据加密** | AES-256 加密 + SHA-256 密码哈希 |
| 🎨 **双主题** | 喜庆红 / 肃穆灰 |
| 📜 **传统格式** | 竖排文字 + 12列网格布局 |
| 📄 **导出** | PDF 打印 / Excel 导出 |
| 🖥️ **双屏联动** | 实时同步展示 |
| 🔄 **路由修复** | 防止无限循环跳转 |

## 🚀 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm run dev

# 3. 访问系统
# 打开 http://localhost:3000
```

## 📖 使用流程

1. **创建事项**：填写名称、时间、密码，选择主题
2. **录入礼金**：输入姓名、金额（自动显示中文大写）
3. **查看导出**：打印/PDF 或导出 Excel

## 🏗️ 项目结构

```
src/
├── app/
│   ├── globals.css          # 全局样式 + 主题
│   ├── page.tsx             # 首页（智能路由）
│   ├── setup/page.tsx       # 创建事项
│   ├── main/page.tsx        # 主界面
│   └── guest-screen/page.tsx # 副屏展示
├── lib/
│   ├── crypto.ts            # AES-256 加密
│   ├── utils.ts             # 工具函数
│   └── github.ts            # GitHub API
└── types/
    └── index.ts             # 类型定义
```

## 🎯 技术栈

| 技术 | 版本 |
|------|------|
| Next.js | 15.1.0 |
| React | 19.0.0 |
| TypeScript | 5.x |
| Tailwind CSS | 3.4.0 |
| CryptoJS | 4.2.0 |
| xlsx | 0.18.5 |

## 🔒 数据安全

- **AES-256**：所有数据加密存储
- **SHA-256**：密码单向哈希
- **客户端加密**：数据在浏览器加密后才传输

## 🧪 单元测试

```bash
# 运行测试
pnpm exec jest --no-coverage

# 查看覆盖率
pnpm exec jest --coverage
```

**测试结果**：52/52 通过 ✅ | 覆盖率 93.84%

## 📦 生产部署

```bash
pnpm run build
pnpm start
```

---

**开始使用**：`pnpm run dev` 🎉

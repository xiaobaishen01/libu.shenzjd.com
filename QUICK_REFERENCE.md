# ⚡ 快速参考卡片

## 🚀 3步启动
```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

## 📋 常用命令
```bash
npm run dev      # 开发服务器
npm run build    # 构建生产版
npm start        # 运行生产版
npm run lint     # 代码检查
```

## 📁 文件速查
```
src/app/page.tsx              # 首页
src/app/setup/page.tsx        # 创建事项
src/app/main/page.tsx         # 主界面
src/app/guest-screen/page.tsx # 副屏
src/lib/crypto.ts             # 加密工具
src/lib/utils.ts              # 工具函数
src/lib/github.ts             # GitHub API
src/types/index.ts            # 类型定义
```

## 🔐 数据存储
- **事件**：`giftlist_events`
- **礼金**：`giftlist_gifts_[id]`
- **GitHub**：`giftlist_github`
- **会话**：`currentEvent`

## 🎨 主题
- **喜庆红**：`theme: 'festive'`
- **肃穆灰**：`theme: 'solemn'`

## 💡 快捷键
- **回车**：提交表单
- **Tab**：切换输入框
- **F11**：全屏（副屏）

## 📤 导出
- **Excel**：`.xlsx` 文件
- **PDF**：浏览器打印
- **副屏**：独立窗口

## 🔒 安全
- **加密**：AES-256
- **哈希**：SHA-256
- **Token**：本地存储

## ✅ 检查清单
- [ ] Node.js ≥ 18
- [ ] npm install 成功
- [ ] 端口 3000 空闲
- [ ] localStorage 可用
- [ ] 浏览器支持

## 🆘 帮助
- `README.md` - 完整说明
- `INSTALL.md` - 安装问题
- `START.md` - 使用指南
- `STRUCTURE.md` - 代码结构

---

**记住：数据无价，及时备份！**

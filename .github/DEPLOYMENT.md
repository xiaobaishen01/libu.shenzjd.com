# GitHub Pages 部署指南

这个项目已经配置了自动部署到 GitHub Pages 的工作流。

## 部署步骤

### 1. 启用 GitHub Pages

在 GitHub 仓库设置中：

1. 进入 **Settings** > **Pages**
2. 在 **Build and deployment** 部分：
   - **Source**: 选择 "GitHub Actions"
3. 保存设置

### 2. 推送代码触发部署

将以下文件推送到 `main` 分支：

```bash
git add .github/workflows/deploy-to-github-pages.yml
git add next.config.ts
git add .gitignore
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### 3. 查看部署状态

- 进入仓库的 **Actions** 标签页
- 等待工作流完成
- 部署成功后，访问地址会在 Actions 页面显示，通常是：
  `https://<your-username>.github.io/<repository-name>/`

## 工作流说明

### 文件结构
- `.github/workflows/deploy-to-github-pages.yml` - GitHub Action 工作流
- `next.config.ts` - Next.js 配置（支持静态导出）
- `.gitignore` - 已更新以包含构建产物

### 工作流触发条件
- 每次推送到 `main` 分支时自动触发
- 也可以手动在 Actions 页面触发

### 构建过程
1. 安装依赖（使用 pnpm）
2. 运行 `next export` 生成静态文件
3. 上传到 GitHub Pages
4. 自动部署

## 本地测试

在本地测试静态导出：

```bash
# 设置环境变量并构建
NEXT_PUBLIC_IS_EXPORT=true pnpm next export

# 查看 out 目录中的输出
ls -la out/
```

## 注意事项

1. **API 路由和服务器组件**: GitHub Pages 只支持静态文件，因此：
   - 不能使用 API 路由
   - 服务器组件会转换为客户端组件
   - 需要避免使用 `getServerSideProps`

2. **图片优化**: 静态导出时已禁用 Next.js 图片优化

3. **Base Path**: 如果你的仓库名不是根路径，需要在 `next.config.ts` 中配置 `basePath`

## 故障排除

### 部署失败
- 检查 Actions 日志
- 确保所有依赖都能正确安装
- 验证代码能在本地成功导出

### 页面 404
- 确认仓库名是否正确
- 检查部署后的 URL
- 确认 `out` 目录中有 `index.html`

## 自定义域名

如果要使用自定义域名：

1. 在仓库的 **Settings** > **Pages** 中添加自定义域名
2. 在 `out` 目录创建 `CNAME` 文件（或在 GitHub Pages 设置中配置）
3. 配置 DNS 记录指向 GitHub

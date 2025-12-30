#!/bin/bash

# 项目清理脚本
# 用于清理项目中的无用文件和缓存

echo "🧹 开始清理项目..."

# 清理构建产物
echo "清理构建产物..."
rm -rf dist/ out/ .next/ 2>/dev/null || true

# 清理依赖缓存
echo "清理依赖缓存..."
rm -rf node_modules/ .pnpm-store/ 2>/dev/null || true

# 清理临时文件
echo "清理临时文件..."
find . -name "*.bak" -delete 2>/dev/null || true
find . -name "*~" -delete 2>/dev/null || true
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name "*.log" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "Thumbs.db" -delete 2>/dev/null || true

# 清理TypeScript构建信息
echo "清理TypeScript构建信息..."
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true

# 清理测试覆盖率
echo "清理测试覆盖率..."
rm -rf coverage/ .nyc_output/ 2>/dev/null || true

# 清理Vite缓存
echo "清理Vite缓存..."
rm -rf node_modules/.vite/ .vite/ 2>/dev/null || true

# 清理pnpm存储（可选，需要重新安装依赖）
# rm -rf ~/.pnpm-store/ 2>/dev/null || true

echo "✅ 清理完成！"
echo ""
echo "如需重新安装依赖，请运行:"
echo "  pnpm install"
echo ""
echo "如需重新构建项目，请运行:"
echo "  pnpm run build"
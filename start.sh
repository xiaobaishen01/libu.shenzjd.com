#!/bin/bash

echo "================================"
echo "  电子礼簿系统 - 启动脚本"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未安装 Node.js"
    echo "请先安装 Node.js 18+"
    echo "下载：https://nodejs.org/"
    exit 1
fi

# 检查 Node 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ 错误：Node.js 版本过低"
    echo "当前版本：$NODE_VERSION"
    echo "需要版本：$REQUIRED_VERSION+"
    exit 1
fi

echo "✅ Node.js 版本：$NODE_VERSION"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

echo ""
echo "🚀 正在启动开发服务器..."
echo ""
echo "提示："
echo "  - 按 Ctrl+C 停止服务器"
echo "  - 访问 http://localhost:3000"
echo "  - 如需退出，请关闭此终端"
echo ""
echo "================================"
echo ""

npm run dev

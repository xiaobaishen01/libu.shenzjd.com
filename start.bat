@echo off
chcp 65001 >nul
echo ================================
echo   电子礼簿系统 - 启动脚本
echo ================================
echo.

:: 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未安装 Node.js
    echo 请先安装 Node.js 18+
    echo 下载：https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装

:: 检查是否已安装依赖
if not exist "node_modules" (
    echo.
    echo 📦 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)

echo.
echo 🚀 正在启动开发服务器...
echo.
echo 提示：
echo   - 按 Ctrl+C 停止服务器
echo   - 访问 http://localhost:3000
echo   - 如需退出，请关闭此窗口
echo.
echo ================================
echo.

call npm run dev

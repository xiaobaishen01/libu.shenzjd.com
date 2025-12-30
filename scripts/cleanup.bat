@echo off
echo.
echo  项目清理脚本
echo ================================
echo.

echo 清理构建产物...
if exist dist rmdir /s /q dist
if exist out rmdir /s /q out
if exist .next rmdir /s /q .next

echo 清理缓存...
if exist .vite rmdir /s /q .vite
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo 清理临时文件...
del /s /q *.bak >nul 2>&1
del /s /q *~ >nul 2>&1
del /s /q *.tmp >nul 2>&1
del /s /q *.log >nul 2>&1
del /s /q .DS_Store >nul 2>&1
del /s /q Thumbs.db >nul 2>&1

echo 清理TypeScript构建信息...
del /s /q *.tsbuildinfo >nul 2>&1

echo 清理测试覆盖率...
if exist coverage rmdir /s /q coverage
if exist .nyc_output rmdir /s /q .nyc_output

echo.
echo ✅ 清理完成！
echo.
echo 如需重新安装依赖，请运行:
echo   pnpm install
echo.
echo 如需重新构建项目，请运行:
echo   pnpm run build
echo.
pause
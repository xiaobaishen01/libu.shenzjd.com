# 项目清理指南

本项目已进行过清理，移除了无用文件。以下是清理的详细说明和日常维护建议。

## 已清理的文件

### 1. 备份文件
- ✅ `src/lib/backup.ts.bak` - backup.ts的旧备份文件

### 2. 过时的测试文件
- ✅ `src/lib/github.test.ts` - GitHub服务测试（对应的服务已从项目中移除）
- ✅ `src/lib/utils.test.ts` - 工具函数测试（测试引用了已废弃的Utils对象）

### 3. 构建产物
- ✅ `dist/` - 构建输出目录（应在.gitignore中，但手动清理以确保）

## 项目现状

### 保留的文件
- ✅ `pnpm-lock.yaml` - 依赖锁定文件（54KB，正常大小）
- ✅ `README.md` - 项目文档
- ✅ `CLAUDE.md` - 开发指南
- ✅ `src/utils/format.ts` - 实际使用的工具函数
- ✅ `src/lib/backup.ts` - Excel导入导出服务
- ✅ `src/lib/voice.ts` - 语音播报服务

### 项目结构优化
```
src/
├── lib/                    # 核心服务
│   ├── backup.ts          # Excel操作（929行，复杂逻辑）
│   └── voice.ts           # 语音播报
├── utils/
│   └── format.ts          # 工具函数（实际使用）
├── store/
│   └── appStore.ts        # 状态管理
└── ...                    # 其他组件
```

## 日常清理建议

### 1. 使用清理脚本
```bash
# 使脚本可执行
chmod +x scripts/cleanup.sh

# 运行清理
./scripts/cleanup.sh
```

### 2. 手动清理命令
```bash
# 清理构建产物
rm -rf dist/ out/ .next/

# 清理依赖（谨慎使用）
rm -rf node_modules/

# 清理临时文件
find . -name "*.bak" -delete
find . -name "*.log" -delete
find . -name ".DS_Store" -delete
```

### 3. Git清理（高级）
```bash
# 查看大文件
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {print $3, $4}' | sort -nr | head -10

# 清理未使用的远程分支
git fetch --prune

# 清理reflog（节省空间）
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## 依赖管理

### 当前依赖（精简）
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.19",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "vite-plugin-singlefile": "^2.3.0"
  }
}
```

### 依赖清理建议
```bash
# 更新依赖到最新版本
pnpm update

# 检查过时依赖
pnpm outdated

# 清理未使用的依赖
pnpm prune
```

## Git忽略文件检查

确保 `.gitignore` 包含：
```
# 构建产物
/dist
/out
/.next

# 依赖
/node_modules

# 临时文件
*.bak
*.log
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# 测试
/coverage
```

## 性能优化建议

### 1. 构建优化
- ✅ 已使用 `vite-plugin-singlefile` 将所有资源内联到单个HTML
- ✅ 已配置 `sourcemap: false` 减少构建大小
- ✅ 使用 `iife` 格式优化浏览器兼容性

### 2. 代码优化
- ✅ 已移除未使用的组件和测试
- ✅ 使用函数式工具模块而非类
- ✅ 按需导入，减少打包体积

### 3. 存储优化
- ✅ 使用localStorage/sessionStorage，无需数据库
- ✅ 数据以JSON字符串存储，无需加密开销
- ✅ 支持Excel导入导出，便于数据迁移

## 维护检查清单

- [ ] 定期清理 `dist/` 目录
- [ ] 检查并清理临时备份文件
- [ ] 更新依赖到安全版本
- [ ] 验证 `.gitignore` 配置
- [ ] 检查是否有大文件需要清理
- [ ] 确保测试文件与实际代码同步

## 注意事项

1. **不要清理** `pnpm-lock.yaml` - 它确保依赖版本一致性
2. **不要清理** `node_modules/` 除非要重新安装依赖
3. **备份重要数据** - 清理前确保已导出重要数据
4. **测试构建** - 清理后验证项目能正常构建

## 相关命令

```bash
# 完整清理并重新安装
rm -rf node_modules/ dist/
pnpm install
pnpm run build

# 仅清理构建产物
rm -rf dist/
pnpm run build

# 检查项目状态
git status
pnpm list --depth=0
```
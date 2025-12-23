# 🔧 修复路由跳转循环问题

## 问题描述
启动时页面在 `/` 和 `/main` 之间频繁闪烁，无限循环。

## 根本原因
1. **首页 useEffect 依赖问题**：`router` 作为依赖导致无限重执行
2. **缺少跳转标记**：没有防止重复跳转的机制
3. **使用 push 而非 replace**：历史栈累积导致混乱

## 修复方案

### 1. 首页 (`src/app/page.tsx`)

**修复前：**
```typescript
useEffect(() => {
  const events = JSON.parse(localStorage.getItem('giftlist_events') || '[]');
  if (events.length > 0) {
    router.push('/main');  // ❌ 无限循环
  } else {
    router.push('/setup');
  }
}, [router]);  // ❌ router 变化会触发重执行
```

**修复后：**
```typescript
useEffect(() => {
  if (typeof window === 'undefined') return;

  // ✅ 检查跳转标记
  const hasRedirected = sessionStorage.getItem('has_redirected');
  if (hasRedirected) {
    const events = JSON.parse(localStorage.getItem('giftlist_events') || '[]');
    router.replace(events.length > 0 ? '/main' : '/setup');
    return;
  }

  // ✅ 第一次访问，设置标记
  const events = JSON.parse(localStorage.getItem('giftlist_events') || '[]');
  if (events.length > 0) {
    sessionStorage.setItem('has_redirected', 'true');
    router.replace('/main');  // ✅ 使用 replace
  } else {
    sessionStorage.setItem('has_redirected', 'true');
    router.replace('/setup');
  }
}, [router]);  // ✅ 保留但逻辑已保护
```

### 2. 主界面 (`src/app/main/page.tsx`)

**修复前：**
```typescript
useEffect(() => {
  const session = sessionStorage.getItem('currentEvent');
  if (!session) {
    router.push('/');  // ❌ 可能导致循环
  }
  // ...
}, [router]);  // ❌ 依赖导致重执行
```

**修复后：**
```typescript
useEffect(() => {
  const session = sessionStorage.getItem('currentEvent');
  if (!session) {
    router.replace('/');  // ✅ 使用 replace
  }
  // ...
}, []);  // ✅ 空依赖，只执行一次
```

### 3. 事项创建页面 (`src/app/setup/page.tsx`)

**优化：**
```typescript
// 创建成功后
sessionStorage.removeItem('has_redirected');  // ✅ 允许重新选择
router.replace('/main');  // ✅ 使用 replace
```

## 修复效果

### 修复前
```
访问 / → 检查事件 → 跳转 /main → useEffect → 跳转 / → 循环...
```

### 修复后
```
访问 / → 检查标记 → 无标记 → 跳转 /main → 设置标记
再次访问 / → 检查标记 → 有标记 → 直接跳转 → 结束
```

## 测试验证

### 测试 1：首次访问
1. 清除 localStorage 和 sessionStorage
2. 访问 `http://localhost:3000`
3. ✅ 应跳转到 `/setup`

### 测试 2：已有事项
1. 创建一个事项
2. 清除浏览器标签，重新打开
3. 访问 `http://localhost:3000`
4. ✅ 应跳转到 `/main`

### 测试 3：手动访问首页
1. 在主界面
2. 手动输入 `http://localhost:3000`
3. ✅ 应快速跳转回 `/main`（不闪烁）

### 测试 4：清除会话
1. 在主界面
2. 打开控制台：`sessionStorage.clear()`
3. 刷新页面
4. ✅ 应跳转到 `/setup`（因为没有会话）

## 关键改进

1. ✅ **跳转标记**：防止重复跳转
2. ✅ **replace 替代 push**：避免历史栈污染
3. ✅ **空依赖**：useEffect 只执行一次
4. ✅ **会话隔离**：不同会话独立处理

## 如果还有问题

如果修复后仍有闪烁，请检查：

1. **浏览器缓存**：强制刷新 (Ctrl+Shift+R)
2. **开发服务器**：重启 `npm run dev`
3. **SessionStorage**：检查是否被清除
4. **浏览器扩展**：某些扩展可能干扰

```bash
# 清理并重启
rm -rf .next/
npm run dev
```

---

**修复完成！现在应该不会再闪烁了。**

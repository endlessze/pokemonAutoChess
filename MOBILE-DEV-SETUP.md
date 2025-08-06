# 📱 移动端开发环境设置 (ngrok)

## 🚀 一键启动

```bash
npm run dev-mobile
```

这个命令会自动：

1. 启动 HTTPS 开发服务器
2. 启动 ngrok 隧道
3. 显示移动端访问链接

## ⚡ 快速设置步骤

### 1. 启动开发环境

```bash
npm run dev-mobile
```

### 2. 复制 ngrok URL

等待终端显示类似这样的信息：

```
📱 公网访问地址: https://abc123.ngrok-free.app
```

### 3. 配置 Firebase

1. 打开 [Firebase 控制台](https://console.firebase.google.com/)
2. 选择你的项目
3. 进入 `Authentication` → `Settings` → `Authorized domains`
4. 点击 `Add domain`
5. 添加 ngrok 域名（不包含 https://）：
   ```
   abc123.ngrok-free.app
   ```

### 4. 移动端访问

在手机浏览器中打开 ngrok URL：

```
https://abc123.ngrok-free.app
```

## 🛠️ 独立命令

### 仅启动 ngrok 隧道

```bash
npm run ngrok
```

### 仅启动开发服务器

```bash
npm run dev
```

## 📝 注意事项

1. **ngrok 免费版限制**：

   - 每次重启 URL 会变化
   - 需要重新添加到 Firebase 授权域名

2. **Firebase 配置**：

   - 只需要添加域名，不需要端口
   - 添加后立即生效，无需重启服务

3. **网络要求**：
   - 需要稳定的网络连接
   - ngrok 会自动处理 HTTPS

## 🔧 故障排查

### ngrok 启动失败

```bash
# 检查是否已安装
ngrok version

# 重新安装
brew install ngrok/ngrok/ngrok
```

### Firebase 认证失败

1. 确认 ngrok URL 已添加到 Firebase 授权域名
2. 清除浏览器缓存
3. 检查网络连接

### 停止所有服务

按 `Ctrl+C` 或：

```bash
# 查找并停止相关进程
pkill -f "dev-mobile\|ngrok"
```

## 💡 开发技巧

1. **保持 ngrok 运行**：开发期间不要关闭 ngrok，避免 URL 变化
2. **书签保存**：将 ngrok URL 保存为书签，方便测试
3. **多设备测试**：同一个 ngrok URL 可以在多个设备上同时访问

## 🎯 优势

✅ **零配置**：无需修改代码  
✅ **一键启动**：单个命令搞定所有设置  
✅ **真实环境**：完全模拟生产环境的 HTTPS  
✅ **多设备**：支持任意设备访问  
✅ **无侵入**：不影响原有开发流程

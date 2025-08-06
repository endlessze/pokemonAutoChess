#!/usr/bin/env node

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "..", ".ngrok-url");
const HTTPS_PORT = process.env.PORT || 9000;
const STATIC_DOMAIN = "enormously-pretty-egret.ngrok-free.app";

async function startNgrok() {
  console.log("🚀 启动 ngrok 隧道 (使用静态域名)...");

  // 启动 ngrok 使用静态域名
  const ngrok = spawn(
    "ngrok",
    ["http", `--url=${STATIC_DOMAIN}`, HTTPS_PORT, "--log=stdout"],
    {
      stdio: ["pipe", "pipe", "pipe"],
    }
  );

  const staticUrl = `https://${STATIC_DOMAIN}`;
  let tunnelEstablished = false;

  ngrok.stdout.on("data", (data) => {
    const output = data.toString();

    // 检查隧道是否建立成功
    if (
      (output.includes("started tunnel") || output.includes("forwarding")) &&
      !tunnelEstablished
    ) {
      tunnelEstablished = true;

      // 保存 URL 到文件
      fs.writeFileSync(CONFIG_FILE, staticUrl);

      console.log("✅ ngrok 隧道已建立 (静态域名)!");
      console.log(`📱 公网访问地址: ${staticUrl}`);
      console.log(`🔒 本地服务器: http://localhost:${HTTPS_PORT}`);
      console.log("");
      console.log("🔥 Firebase 配置 (一次性设置):");
      console.log(
        `1. 打开 Firebase 控制台: https://console.firebase.google.com/`
      );
      console.log(`2. 进入 Authentication → Settings → Authorized domains`);
      console.log(`3. 添加域名: ${STATIC_DOMAIN}`);
      console.log("   (静态域名只需添加一次!)");
      console.log("");
      console.log("⚡ 开发服务器启动命令:");
      console.log("   npm run dev");
      console.log("");
      console.log("📱 移动设备访问:");
      console.log(`   ${staticUrl}`);
      console.log("");
      console.log("💡 提示: 静态域名每次都一样，无需重复配置 Firebase");
      console.log("❌ 停止服务: Ctrl+C");
    }
  });

  ngrok.stderr.on("data", (data) => {
    console.error("ngrok 错误:", data.toString());
  });

  ngrok.on("close", (code) => {
    console.log(`\n🛑 ngrok 进程已退出，代码: ${code}`);

    // 清理配置文件
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
  });

  // 处理进程退出
  process.on("SIGINT", () => {
    console.log("\n🛑 正在停止 ngrok...");
    ngrok.kill();
    process.exit(0);
  });
}

// 检查是否已有 ngrok 进程
function checkExistingNgrok() {
  if (fs.existsSync(CONFIG_FILE)) {
    const staticUrl = `https://${STATIC_DOMAIN}`;
    console.log(`✅ 检测到现有的 ngrok 隧道 (静态域名): ${staticUrl}`);
    console.log("📱 移动设备访问:");
    console.log(`   ${staticUrl}`);
    console.log("");
    console.log("🔥 Firebase 配置 (已配置):");
    console.log(`   域名: ${STATIC_DOMAIN}`);
    console.log("   静态域名无需重复添加到 Firebase");
    console.log("");
    console.log("💡 提示: 静态域名每次都一样，保持稳定连接");
    console.log("❌ 停止服务: Ctrl+C");

    // 监听退出信号，清理文件
    process.on("SIGINT", () => {
      console.log("\n🛑 正在停止 ngrok...");
      if (fs.existsSync(CONFIG_FILE)) {
        fs.unlinkSync(CONFIG_FILE);
      }
      process.exit(0);
    });

    // 保持进程运行
    setInterval(() => {}, 1000);
    return true;
  }
  return false;
}

if (!checkExistingNgrok()) {
  startNgrok().catch(console.error);
}

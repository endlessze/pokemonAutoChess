#!/usr/bin/env node

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "..", ".ngrok-url");
const HTTPS_PORT = process.env.PORT || 9000;

async function startNgrok() {
  console.log("🚀 启动 ngrok 隧道...");

  // 启动 ngrok
  const ngrok = spawn("ngrok", ["http", HTTPS_PORT, "--log=stdout"], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  let ngrokUrl = "";

  ngrok.stdout.on("data", (data) => {
    const output = data.toString();

    // 查找 HTTPS URL
    const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app/);
    if (urlMatch && !ngrokUrl) {
      ngrokUrl = urlMatch[0];

      // 保存 URL 到文件
      fs.writeFileSync(CONFIG_FILE, ngrokUrl);

      console.log("✅ ngrok 隧道已建立!");
      console.log(`📱 公网访问地址: ${ngrokUrl}`);
      console.log(`🔒 本地HTTPS地址: https://localhost:${HTTPS_PORT}`);
      console.log("");
      console.log("🔥 Firebase 配置步骤:");
      console.log(
        `1. 打开 Firebase 控制台: https://console.firebase.google.com/`
      );
      console.log(`2. 进入 Authentication → Settings → Authorized domains`);
      console.log(`3. 添加域名: ${ngrokUrl.replace("https://", "")}`);
      console.log("");
      console.log("⚡ 开发服务器启动命令:");
      console.log("   npm run dev");
      console.log("");
      console.log("📱 移动设备访问:");
      console.log(`   ${ngrokUrl}`);
      console.log("");
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
    const existingUrl = fs.readFileSync(CONFIG_FILE, "utf8").trim();
    console.log(`✅ 检测到现有的 ngrok 隧道: ${existingUrl}`);
    console.log("📱 移动设备访问:");
    console.log(`   ${existingUrl}`);
    console.log("");
    console.log("🔥 Firebase 配置步骤:");
    console.log(
      `1. 打开 Firebase 控制台: https://console.firebase.google.com/`
    );
    console.log(`2. 进入 Authentication → Settings → Authorized domains`);
    console.log(`3. 添加域名: ${existingUrl.replace("https://", "")}`);
    console.log("");
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

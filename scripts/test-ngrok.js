#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 启动移动端开发环境...\n");

// 启动开发服务器
console.log("1️⃣ 启动 HTTPS 开发服务器...");
const devServer = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
});

// 等待一下再启动 ngrok
setTimeout(() => {
  console.log("\n2️⃣ 启动 ngrok 隧道...");
  const ngrok = spawn("node", ["scripts/start-ngrok.js"], {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });

  // 处理退出
  process.on("SIGINT", () => {
    console.log("\n🛑 正在停止所有服务...");
    devServer.kill();
    ngrok.kill();
    process.exit(0);
  });
}, 3000);

console.log("\n💡 使用提示:");
console.log("- 等待 ngrok URL 显示后，复制到 Firebase 控制台");
console.log("- 使用生成的 ngrok URL 在移动设备上访问");
console.log("- 按 Ctrl+C 停止所有服务");

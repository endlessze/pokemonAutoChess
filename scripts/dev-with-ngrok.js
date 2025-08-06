#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 启动 Pokemon Auto Chess 移动端开发环境...\n");

// 启动开发服务器
console.log("1️⃣ 启动本地开发服务器...");
const devServer = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
});

// 等待开发服务器启动后再启动 ngrok
setTimeout(() => {
  console.log("\n2️⃣ 启动 ngrok 隧道 (静态域名)...");
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
}, 5000); // 等待5秒让开发服务器启动

console.log("\n💡 使用提示:");
console.log("- 本地访问: http://localhost:9000");
console.log("- 移动端访问: https://enormously-pretty-egret.ngrok-free.app");
console.log("- Firebase 域名已预配置，无需重复添加");
console.log("- 按 Ctrl+C 停止所有服务");
console.log("");

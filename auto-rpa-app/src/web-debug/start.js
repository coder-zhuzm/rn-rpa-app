#!/usr/bin/env node

/**
 * Web调试服务器启动脚本
 */

const webDebugServer = require('./server');

// 启动服务器
const server = webDebugServer.start();

// 处理进程终止信号
process.on('SIGINT', () => {
  console.log('正在关闭Web调试服务器...');
  webDebugServer.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('正在关闭Web调试服务器...');
  webDebugServer.stop();
  process.exit(0);
});

console.log('按 Ctrl+C 停止服务器');

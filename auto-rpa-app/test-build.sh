#!/bin/bash

echo "🚀 开始测试 RPA App 构建..."

# 检查 Node.js 和 npm
echo "📦 检查依赖..."
node --version
npm --version

# 安装依赖
echo "📥 安装 npm 依赖..."
npm install

# 检查 TypeScript 编译
echo "🔍 检查 TypeScript 编译..."
npx tsc --noEmit

# 检查 Android 构建
echo "🤖 检查 Android 构建..."
cd android
./gradlew assembleDebug --no-daemon
cd ..

echo "✅ 构建测试完成！"
echo ""
echo "📱 运行应用："
echo "1. 启动 Metro: npm start"
echo "2. 运行 Android: npm run android"
echo "3. 查看日志: adb logcat | grep RPAServiceModule" 
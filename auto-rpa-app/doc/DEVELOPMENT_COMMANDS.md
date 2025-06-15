# RPA App 开发常用命令

## 📱 项目基本信息

- **项目名称**: auto-rpa-app
- **包名**: com.rpaapp
- **平台**: React Native + Android
- **主要功能**: RPA 自动化 + 动态脚本执行

---

## 🚀 环境准备

### 检查开发环境

```bash
# 检查 React Native 环境
npx react-native doctor

# 检查 Java 版本 (需要 Java 17)
java -version

# 检查 Android SDK
adb version

# 检查 Node.js 版本
node -v
npm -v
```

### 环境变量设置

```bash
# 设置 Java 17 (如果需要)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home

# Android SDK 路径
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## 🔧 项目构建命令

### 安装依赖

```bash
# 安装 npm 依赖
npm install

# 清理 npm 缓存 (如果遇到问题)
npm cache clean --force
```

### Android 构建

```bash
# 进入 Android 目录
cd android

# 清理构建缓存
./gradlew clean

# 构建 Debug APK
./gradlew assembleDebug

# 构建 Release APK
./gradlew assembleRelease

# 返回项目根目录
cd ..
```

### React Native 构建

```bash
# 构建 Android (自动安装到设备)
npx react-native run-android

# 仅构建不安装
npx react-native build-android

# 清理 Metro 缓存
npx react-native start --reset-cache
```

---

## 📱 设备管理

### 模拟器操作

```bash
# 列出可用的 AVD
emulator -list-avds

# 启动指定模拟器
emulator -avd Pixel_6

# 启动模拟器 (后台运行)
emulator -avd Pixel_6 &
```

### 设备连接

```bash
# 查看连接的设备
adb devices

# 连接到指定设备
adb -s emulator-5554 shell

# 重启 ADB 服务
adb kill-server
adb start-server
```

---

## 📦 应用安装与管理

### APK 安装

```bash
# 安装 Debug APK
adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk

# 安装 Release APK
adb -s emulator-5554 install -r android/app/build/outputs/apk/release/app-release.apk

# 强制重新安装
adb -s emulator-5554 install -r -d android/app/build/outputs/apk/debug/app-debug.apk
```

### 应用控制

```bash
# 启动应用
adb -s emulator-5554 shell am start -n com.rpaapp/.MainActivity

# 停止应用
adb -s emulator-5554 shell am force-stop com.rpaapp

# 清除应用数据
adb -s emulator-5554 shell pm clear com.rpaapp

# 卸载应用
adb -s emulator-5554 uninstall com.rpaapp
```

---

## 🐛 调试命令

### 日志查看

```bash
# 查看所有日志
adb -s emulator-5554 logcat

# 查看 React Native JS 日志
adb -s emulator-5554 logcat -s ReactNativeJS:V

# 查看应用特定日志
adb -s emulator-5554 logcat | grep com.rpaapp

# 清除日志缓存
adb -s emulator-5554 logcat -c

# 保存日志到文件
adb -s emulator-5554 logcat > app_logs.txt
```

### 开发者菜单

```bash
# 打开 React Native 开发者菜单 (摇一摇)
adb -s emulator-5554 shell input keyevent 82

# 重新加载 JS
adb -s emulator-5554 shell input text "RR"

# 打开 Chrome 调试器
# 在开发者菜单中选择 "Debug JS Remotely"
```

### Metro 开发服务器

```bash
# 启动 Metro 服务器
npx react-native start

# 重置缓存启动
npx react-native start --reset-cache

# 指定端口启动
npx react-native start --port 8082
```

---

## 🔍 文件系统操作

### 应用文件管理

```bash
# 查看应用数据目录
adb -s emulator-5554 shell ls -la /data/data/com.rpaapp/

# 查看脚本目录
adb -s emulator-5554 shell ls -la /data/data/com.rpaapp/files/Documents/rpa-scripts/

# 推送文件到设备
adb -s emulator-5554 push local_file.js /data/data/com.rpaapp/files/Documents/rpa-scripts/

# 从设备拉取文件
adb -s emulator-5554 pull /data/data/com.rpaapp/files/Documents/rpa-scripts/script.js ./
```

### 权限管理

```bash
# 查看应用权限
adb -s emulator-5554 shell dumpsys package com.rpaapp | grep permission

# 授予权限 (如果需要)
adb -s emulator-5554 shell pm grant com.rpaapp android.permission.WRITE_EXTERNAL_STORAGE
```

---

## 🚀 快速开发流程

### 完整构建流程

```bash
# 1. 清理环境
cd android && ./gradlew clean && cd ..

# 2. 安装依赖
npm install

# 3. 构建并安装
npx react-native run-android

# 或者分步执行:
# 3a. 构建 APK
cd android && ./gradlew assembleDebug && cd ..

# 3b. 安装 APK
adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk

# 3c. 启动应用
adb -s emulator-5554 shell am start -n com.rpaapp/.MainActivity
```

### 快速重新部署

```bash
# 仅重新构建和安装 (不清理)
cd android && ./gradlew assembleDebug && cd .. && \
adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk && \
adb -s emulator-5554 shell am start -n com.rpaapp/.MainActivity
```

### 热重载开发

```bash
# 启动 Metro 服务器 (终端1)
npx react-native start

# 在另一个终端中运行应用 (终端2)
npx react-native run-android

# 之后修改 JS 代码会自动热重载
```

---

## 🧪 测试命令

### 脚本测试

```bash
# 查看脚本执行日志
adb -s emulator-5554 logcat -s ReactNativeJS:V | grep -i script

# 测试原生模块
adb -s emulator-5554 logcat | grep -i RPA
```

### 性能测试

```bash
# 查看应用内存使用
adb -s emulator-5554 shell dumpsys meminfo com.rpaapp

# 查看 CPU 使用
adb -s emulator-5554 shell top | grep com.rpaapp
```

---

## 🔧 故障排除

### 常见问题解决

```bash
# Metro 端口被占用
lsof -ti:8081 | xargs kill -9
npx react-native start

# Gradle 构建失败
cd android
./gradlew clean
./gradlew --stop
cd ..

# ADB 连接问题
adb kill-server
adb start-server
adb devices

# 模拟器无响应
adb -s emulator-5554 reboot
```

### 重置开发环境

```bash
# 完全重置项目
npm cache clean --force
rm -rf node_modules
npm install
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

---

## 📋 常用别名设置

将以下别名添加到 `~/.zshrc` 或 `~/.bashrc`:

```bash
# RPA App 开发别名
alias rpa-build="cd android && ./gradlew assembleDebug && cd .."
alias rpa-install="adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk"
alias rpa-start="adb -s emulator-5554 shell am start -n com.rpaapp/.MainActivity"
alias rpa-stop="adb -s emulator-5554 shell am force-stop com.rpaapp"
alias rpa-log="adb -s emulator-5554 logcat -s ReactNativeJS:V"
alias rpa-deploy="rpa-build && rpa-install && rpa-start"
alias rpa-clean="cd android && ./gradlew clean && cd .. && npm cache clean --force"
```

使用别名后，开发流程变为:

```bash
# 快速部署
rpa-deploy

# 查看日志
rpa-log

# 重启应用
rpa-stop && rpa-start
```

---

## 📞 技术支持

### 有用的链接

- [React Native 官方文档](https://reactnative.dev/docs/getting-started)
- [Android 开发者文档](https://developer.android.com/docs)
- [Hermes 引擎文档](https://hermesengine.dev/)

### 项目结构

```
RPAApp/
├── android/                 # Android 原生代码
├── src/
│   ├── components/          # React 组件
│   ├── managers/           # 脚本管理器
│   ├── modules/            # 原生模块接口
│   └── types/              # TypeScript 类型定义
├── example-scripts/        # 示例脚本
└── SCRIPT_USAGE.md        # 脚本使用文档
```

---

**💡 提示**: 将此文档保存为书签，开发时随时查阅！

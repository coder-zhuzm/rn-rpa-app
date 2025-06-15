# RPA App 开发常用命令

这个文档整理了RPA App项目开发过程中的常用命令，方便快速开发和调试。

## 📱 应用启动命令

### React Native 开发环境

```bash
# 进入项目目录
cd auto-rpa-app

# 启动Metro开发服务器
npm run start
# 或者
npx react-native start

# 启动Android应用（推荐）
npm run android
# 或者
npx react-native run-android

# 启动iOS应用（需要macOS）
npm run ios
# 或者
npx react-native run-ios

# 清理缓存后启动Metro服务器
npx react-native start --reset-cache
```

### Android 调试命令

```bash
# 查看连接的Android设备
adb devices

# 启动Android模拟器（如果已配置）
emulator -avd <模拟器名称>

# 查看应用日志
adb logcat | grep "Auto RPA App"

# 安装调试APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 安装并覆盖现有应用
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# 安装到指定设备
adb -s emulator-5554 install android/app/build/outputs/apk/debug/app-debug.apk

# 卸载应用
adb uninstall com.rpaapp

# 清理应用数据
adb shell pm clear com.rpaapp

# 转发端口（用于HTTP服务器调试）
adb reverse tcp:8080 tcp:8080
```

### iOS 调试命令（macOS）

```bash
# 列出可用的iOS模拟器
xcrun simctl list devices

# 启动指定模拟器
xcrun simctl boot "<模拟器ID>"


```

## 🔧 Web调试界面

### 启动Web调试服务器

```bash
# 启动Web调试界面（包含代理服务器）
cd auto-rpa-app
npm run web-debug

# 手动启动Node.js代理服务器
node src/web-debug/server.js

# 直接打开Web调试界面（需要先启动RPA应用）
open src/web-debug/public/index.html
```

### Web调试相关

```bash
# 检查Web服务器状态
curl http://localhost:3000/proxy/192.168.1.100:8080/status

# 测试脚本执行
curl -X POST http://localhost:3000/proxy/192.168.1.100:8080/execute-script \
  -H "Content-Type: application/json" \
  -d '{"script":"console.log(\"test\"); return \"success\";"}'
```

## 📦 项目管理命令

### 依赖管理

```bash
# 安装项目依赖
cd auto-rpa-app
npm install

# 安装新的依赖
npm install <package-name>
npm install <package-name> --save-dev

# 更新依赖
npm update

# 清理node_modules并重新安装
rm -rf node_modules package-lock.json
npm install

# 检查过期的包
npm outdated


```

### 代码质量

```bash
# 运行ESLint检查
npm run lint

# 自动修复ESLint问题
npm run lint -- --fix

# 运行测试
npm run test
npm test

# 运行测试并查看覆盖率
npm test -- --coverage

# 格式化代码（如果配置了Prettier）
npx prettier --write .
```

## 🏗️ 构建和发布

### Android构建

```bash
# 生成调试APK（用于开发和测试）
cd auto-rpa-app/android
./gradlew assembleDebug
# 输出位置: android/app/build/outputs/apk/debug/app-debug.apk

# 生成发布APK（需要先配置签名）
./gradlew assembleRelease
# 输出位置: android/app/build/outputs/apk/release/app-release.apk

# 清理构建缓存
./gradlew clean

# 查看构建详情
./gradlew assembleDebug --info

# 构建完成后直接安装到设备
./gradlew assembleDebug && adb install app/build/outputs/apk/debug/app-debug.apk

# 完整的清理+构建流程
./gradlew clean assembleDebug

# 构建所有变体（调试和发布）
./gradlew assemble

# 查看可用的构建任务
./gradlew tasks --group=build
```

#### APK文件说明
- **调试版本**: 包含调试信息，使用调试签名，文件较大，仅用于开发测试
- **发布版本**: 经过优化和混淆，使用发布签名，文件较小，用于正式发布



## 🔍 调试和日志

### 应用日志

```bash
# Android日志（实时）
adb logcat | grep -E "(auto-rpa-app|ReactNativeJS)"

# Android日志（保存到文件）
adb logcat > rpa_app_logs.txt

# 查看HTTP服务器日志
adb logcat | grep HttpService

# 查看脚本执行日志
adb logcat | grep ScriptManager
```

### 网络调试

```bash
# 检查设备IP地址
adb shell ip addr show wlan0

# 测试HTTP服务器连通性
ping <设备IP>
curl http://<设备IP>:8080/status

# 查看端口占用情况
netstat -an | grep 8080
lsof -i :8080
```

### React Native调试

```bash
# 打开开发菜单（Android）
adb shell input keyevent 82

# 启用快速刷新
# 在开发菜单中选择 "Enable Fast Refresh"

# 打开Chrome调试器
# 在开发菜单中选择 "Debug JS Remotely"

# Flipper调试（如果已安装）
npx flipper
```

## 🛠️ 开发工具

### Git操作

```bash
# 查看项目状态
git status

# 提交更改
git add .
git commit -m "功能描述"

# 推送到远程仓库
git push origin main

# 查看提交历史
git log --oneline

# 创建新分支
git checkout -b feature/new-feature
```

### 项目清理

```bash
# 清理React Native缓存
npx react-native start --reset-cache

# 清理npm缓存
npm cache clean --force

# 清理Watchman缓存（macOS）
watchman watch-del-all

# 清理临时文件
rm -rf /tmp/react-*
rm -rf /tmp/metro-*

# 重置整个项目（小心使用）
cd auto-rpa-app
rm -rf node_modules package-lock.json
rm -rf android/app/build
rm -rf ios/build
npm install
```

## 🔄 常用开发流程

### 快速启动开发环境

```bash
# 1. 启动Metro服务器
cd auto-rpa-app && npm start

# 2. 在新终端窗口启动应用
npm run android

# 3. 在第三个终端窗口启动Web调试
npm run web-debug
```

### 调试问题排查

```bash
# 1. 检查设备连接
adb devices

# 2. 检查端口转发
adb reverse tcp:8080 tcp:8080

# 3. 查看应用日志
adb logcat | grep "auto-rpa-app"

# 4. 测试HTTP服务器
curl http://localhost:8080/status
```

### 构建发布版本

```bash
# 1. 清理项目
npm run clean  # 如果有配置
./gradlew clean

# 2. 安装依赖
npm install

# 3. 构建发布版本
cd android && ./gradlew assembleRelease
```

## 📝 注意事项

1. **设备连接**: 确保Android设备已开启USB调试
2. **网络配置**: 确保设备和电脑在同一网络
3. **端口冲突**: 如果8080端口被占用，可以修改应用配置
4. **权限问题**: Android应用需要网络权限才能启动HTTP服务器
5. **缓存问题**: 如果遇到奇怪问题，先尝试清理各种缓存

## 🆘 常见问题解决

### Metro服务器启动失败
```bash
# 杀死占用端口的进程
lsof -ti:8081 | xargs kill -9
npx react-native start
```

### Android构建失败
```bash
# 清理并重新构建
cd android
./gradlew clean
./gradlew assembleDebug
```

### 设备无法连接
```bash
# 重启adb服务
adb kill-server
adb start-server
adb devices
```

---

**提示**: 将此文档加入书签，在开发过程中随时查阅。根据项目发展情况，可以持续更新和完善这些命令。 
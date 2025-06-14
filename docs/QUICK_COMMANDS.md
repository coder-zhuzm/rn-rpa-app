# 🚀 RPA App 快速命令参考

## 启动应用（最常用）

```bash
cd RPAApp
npm start              # 启动Metro服务器
npm run android        # 启动Android应用
npm run web-debug      # 启动Web调试界面
```

## 调试命令

```bash
adb devices                          # 查看设备
adb reverse tcp:8080 tcp:8080       # 端口转发
adb logcat | grep RPAApp            # 查看日志
adb shell input keyevent 82         # 打开RN调试菜单
```

## 项目管理

```bash
npm install                    # 安装依赖
npm run lint                   # 代码检查
./gradlew clean               # 清理Android构建
npx react-native start --reset-cache  # 清理缓存启动
```

## 网络测试

```bash
curl http://localhost:8080/status                    # 测试应用HTTP服务器
curl http://localhost:3000/proxy/192.168.1.100:8080/status  # 测试代理服务器
```

## 故障排除

```bash
lsof -ti:8081 | xargs kill -9    # 杀死占用Metro端口的进程
adb kill-server && adb start-server  # 重启ADB服务
rm -rf node_modules && npm install   # 重新安装依赖
```

---
💡 **提示**: 建议将此文件置顶，开发时快速查阅 
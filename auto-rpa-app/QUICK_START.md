# 🚀 RPA 应用快速开始指南

本指南将帮助您快速上手重新整理后的 RPA 应用项目。

## ✅ 前置条件

- Node.js (v16+)
- Android SDK
- React Native CLI
- Android 设备或模拟器

## 📦 安装依赖

```bash
cd auto-rpa-app
npm install
```

## 🏃‍♂️ 启动应用

### 1. 启动 Metro 服务器

```bash
npm start
```

### 2. 运行 Android 应用

在新的终端窗口中：

```bash
npm run android
```

### 3. 启动 Web 调试服务器

在另一个终端窗口中：

```bash
npm run web-debug
```

## 🌐 访问 Web 调试界面

在浏览器中打开：`http://localhost:3002`

## 🎯 主要功能测试

### 1. 测试 RPA 服务

1. 在应用中点击"启动 RPA 服务"
2. 查看 Android 日志确认服务启动

### 2. 测试 HTTP 服务器

1. 查看应用界面中的"HTTP 服务器状态"
2. 确认显示"运行中"和设备 IP 地址

### 3. 测试 Web 远程调试

1. 打开 Web 调试界面
2. 在脚本输入框中输入测试脚本：
   ```javascript
   console.log('Hello from Web!');
   Alert.alert('测试', 'Web调试成功!');
   return '测试完成';
   ```
3. 点击"执行"按钮
4. 查看执行结果

### 4. 测试移动端脚本执行器

1. 在应用中点击"📜 脚本执行器"
2. 点击"加载示例"
3. 点击"执行"按钮
4. 查看执行结果

## 🔧 故障排除

### 应用无法启动

- 确保 Android 设备已连接并启用开发者模式
- 检查 Android SDK 路径配置
- 重新安装依赖：`rm -rf node_modules && npm install`

### Web 调试服务器端口冲突

- 默认端口为 3002，如有冲突可修改 `src/web-debug/server.js` 中的 PORT 值

### 无法连接设备

- 确保设备和电脑在同一 WiFi 网络
- 检查防火墙设置
- 尝试使用 USB 连接

### getInstance 错误

- 清除 Metro 缓存：`npm start --reset-cache`
- 重新构建：`cd android && ./gradlew clean && cd .. && npm run android`

### JSON 解析错误 🆕

如果遇到 "JSON Parse error" 错误：

1. **检查请求格式**：

   - 打开浏览器开发者工具 (F12)
   - 查看 Network 标签中的请求详情
   - 确认 Request Payload 格式正确

2. **查看 Android 日志**：

   ```bash
   adb logcat | grep -i "json\|script\|rpa"
   ```

3. **尝试代理模式**：

   - 在 Web 界面点击"使用代理连接"
   - 观察是否解决问题

4. **使用 curl 测试**：
   ```bash
   curl -X POST http://[设备IP]:8080/execute-script \
     -H "Content-Type: application/json" \
     -d '{"script":"console.log(\"test\");"}'
   ```

详细的调试指南请参考：[DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md)

## 📝 开发提示

### 添加新功能

1. 在相应的目录下创建新文件
2. 遵循现有的命名约定
3. 添加适当的 TypeScript 类型定义
4. 更新相关的导出文件

### 调试建议

1. 使用 Android Studio 的 Logcat 查看原生日志
2. 使用 React Native Debugger 调试 JavaScript 代码
3. 使用 Web 调试界面测试脚本逻辑

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 添加详细的注释
- 使用有意义的变量名和函数名

## 📚 相关文档

- [目录结构说明](./DIRECTORY_STRUCTURE.md)
- [Web 调试说明](./src/web-debug/README_WEB_DEBUG.md)
- [项目 README](./README.md)

## 🆘 获取帮助

如果遇到问题：

1. 检查控制台错误信息
2. 查看 Android Logcat 日志
3. 确认所有服务正常启动
4. 检查网络连接和防火墙设置

祝您使用愉快！🎉

# 🚀 RPA App 技术速查表

## 📋 项目信息
- **平台**: Android Only
- **React Native**: 0.80.x
- **Android SDK**: API 33
- **构建工具**: Gradle 8.14.1

## 🔧 关键配置文件

### gradle.properties
```properties
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m

android.useAndroidX=true
android.enableJetifier=true
kotlin.incremental=true
```

### react-native.config.js
```javascript
module.exports = {
  dependencies: {
    'react-native-http-bridge': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-http-bridge/android/',
          packageImportPath: 'import me.alwx.HttpServer.HttpServerReactPackage;',
        },
      },
    },
  },
};
```

## 🛠️ 常用命令

### 本地开发
```bash
# 安装依赖
cd auto-rpa-app && npm install

# 应用补丁
npx patch-package

# 启动 Metro
npm start

# 构建 Debug APK
cd android && ./gradlew assembleDebug

# 构建 Release APK
cd android && ./gradlew assembleRelease
```

### 清理重置
```bash
# 清理所有缓存
npm run clean:all

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

## 🔍 故障排除

### 构建失败
1. **内存不足**: 检查 gradle.properties 中的 JVM 设置
2. **依赖冲突**: 运行 `npx patch-package` 应用补丁
3. **缓存问题**: 执行 `./gradlew clean`

### 原生模块问题
1. **模块未找到**: 检查 MainApplication.kt 中的模块注册
2. **链接错误**: 验证 react-native.config.js 配置
3. **权限问题**: 确认 AndroidManifest.xml 权限声明

## 🚢 发布流程

### 创建发布版本
```bash
# 1. 创建并推送标签
git tag v0.1.x
git push origin v0.1.x

# 2. GitHub Actions 自动构建和发布
# 3. 检查 GitHub Releases 页面获取 APK
```

### CI/CD 工作流
- **CI 检查**: PR 到 main 分支时触发
- **发布构建**: 推送标签时触发
- **手动触发**: workflow_dispatch 事件

## 📱 APK 信息
- **Debug 版本**: ~99MB (包含调试信息)
- **Release 版本**: ~46MB (优化压缩)
- **签名**: 使用 debug.keystore (开发版本)

## 🔒 权限要求
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
```

## 📂 关键文件路径
```
auto-rpa-app/
├── android/app/src/main/java/com/rpaapp/
│   ├── MainActivity.kt
│   ├── MainApplication.kt
│   ├── RPAServiceModule.kt
│   ├── RPAServicePackage.kt
│   └── UIAutomatorHelper.kt
├── patches/
│   └── react-native-http-bridge+0.6.1.patch
└── react-native.config.js
```

## 🔄 更新补丁
```bash
# 修改 node_modules 中的包
# 然后重新生成补丁
npx patch-package react-native-http-bridge
```

---
*快速参考 - 最后更新: 2024* 
# RPA Service Module 使用说明

## 概述

这个项目包含了一个 React Native 应用和一个 Android 原生模块 `RPAServiceModule`，
用于执行 UI 自动化任务。

## 项目结构

```
RPAApp/
├── android/
│   └── app/src/main/java/com/rpaapp/
│       ├── RPAServiceModule.kt      # 原生模块实现
│       ├── RPAServicePackage.kt     # 模块包注册
│       └── MainApplication.kt       # 应用入口（已注册模块）
├── src/
│   ├── modules/
│   │   └── RPAServiceModule.ts      # JS 端模块接口
│   └── types/
│       └── RPAServiceModule.ts      # TypeScript 类型定义
├── App.tsx                          # 主应用界面
└── package.json
```

## 功能特性

### 当前功能

- ✅ Android 原生模块 `RPAServiceModule`
- ✅ 暴露 `start()` 方法，初始化 RPA 服务
- ✅ UI Automator 集成，支持应用启动功能
- ✅ 系统设置启动：`launchSettings()`
- ✅ WiFi 设置启动：`launchWifiSettings()`
- ✅ 蓝牙设置启动：`launchBluetoothSettings()`
- ✅ 通过包名启动应用：`launchAppByPackage(packageName)`
- ✅ JavaScript 端接口封装
- ✅ TypeScript 类型支持
- ✅ 完整的测试界面

### 计划功能

- 🔄 UI 自动化任务执行
- 🔄 屏幕截图和元素识别
- 🔄 手势模拟（点击、滑动等）
- 🔄 任务调度和管理

## 如何运行

### 1. 安装依赖

```bash
cd auto-rpa-app
npm install
```

### 2. 启动 Metro 服务器

```bash
npm start
```

### 3. 运行 Android 应用

```bash
npm run android
```

### 4. 测试原生模块

1. 在应用中点击各种按钮测试功能：

   - "启动 RPA 服务"：初始化 UI Automator
   - "启动系统设置"：打开 Android 系统设置
   - "启动 WiFi 设置"：直接打开 WiFi 设置页面
   - "启动蓝牙设置"：直接打开蓝牙设置页面

2. 查看 Android 日志输出：

```bash
adb logcat | grep -E "(RPAServiceModule|UIAutomatorHelper)"
```

## 开发指南

### 添加新的原生方法

1. 在 `RPAServiceModule.kt` 中添加新方法：

```kotlin
@ReactMethod
fun newMethod(param: String, promise: Promise) {
    try {
        Log.d(TAG, "New method called with: $param")
        // 执行你的逻辑
        promise.resolve("Method executed successfully")
    } catch (e: Exception) {
        promise.reject("METHOD_ERROR", "Method failed: ${e.message}", e)
    }
}
```

2. 在 `src/types/RPAServiceModule.ts` 中添加类型定义：

```typescript
export interface RPAServiceModuleInterface {
  start(): void;
  launchSettings(): Promise<string>;
  launchWifiSettings(): Promise<string>;
  launchBluetoothSettings(): Promise<string>;
  launchAppByPackage(packageName: string): Promise<string>;
  newMethod(param: string): Promise<string>;
}
```

3. 在 JavaScript 端调用：

```typescript
import RPAServiceModule from './src/modules/RPAServiceModule';

const handleNewMethod = async () => {
  try {
    const result = await RPAServiceModule.newMethod('test parameter');
    console.log(result);
  } catch (error) {
    console.error('Method failed:', error);
  }
};
```

### 调试技巧

1. **查看 Android 日志**：

```bash
adb logcat | grep "RPAServiceModule"
```

2. **重新构建原生代码**：

```bash
cd android
./gradlew clean
cd ..
npm run android
```

3. **清除缓存**：

```bash
npm start -- --reset-cache
```

## 注意事项

1. 修改原生代码后需要重新构建应用
2. 确保 Android 设备或模拟器已连接
3. 原生模块的方法调用是异步的
4. 查看日志需要使用 `adb logcat` 命令

## 下一步计划

1. 添加 UI 自动化相关的 Android 权限
2. 实现屏幕截图功能
3. 添加元素查找和操作方法
4. 实现手势模拟功能
5. 添加任务调度机制

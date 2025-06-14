# RPA App 项目概览

## 🎯 项目简介

**RPA App** 是一个基于 React Native 的移动端 RPA (机器人流程自动化) 应用，支持动态 JavaScript 脚本执行和 Android UI 自动化操作。

### 核心特性
- ✅ **Android 原生模块集成** - 通过 UI Automator 实现系统级自动化
- ✅ **动态脚本执行** - 支持从本地文件加载和执行 JavaScript 脚本
- ✅ **安全沙箱环境** - 脚本在受控环境中执行，确保系统安全
- ✅ **可视化脚本管理** - 内置脚本编辑器和管理界面
- ✅ **实时日志输出** - 完整的执行日志和错误处理

---

## 🏗️ 项目架构

### 技术栈
- **前端框架**: React Native 0.80.0
- **开发语言**: TypeScript + JavaScript (ES5 兼容)
- **原生平台**: Android (Java/Kotlin)
- **JavaScript 引擎**: Hermes
- **构建工具**: Gradle + Metro
- **文件系统**: react-native-fs

### 架构图
```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Layer                       │
├─────────────────────────────────────────────────────────────┤
│  App.tsx (主界面)                                           │
│  ├── ScriptExecutor (脚本执行器组件)                        │
│  └── RPAServiceModule (原生模块接口)                        │
├─────────────────────────────────────────────────────────────┤
│                    JavaScript Layer                         │
│  ├── ScriptManager (脚本管理器)                             │
│  ├── 动态脚本执行引擎                                       │
│  └── 安全沙箱环境                                           │
├─────────────────────────────────────────────────────────────┤
│                    Native Android Layer                     │
│  ├── RPAServiceModule.kt (原生模块实现)                     │
│  ├── UIAutomatorHelper.kt (UI 自动化辅助类)                 │
│  └── RPAServicePackage.kt (模块注册)                        │
├─────────────────────────────────────────────────────────────┤
│                    Android System                           │
│  ├── UI Automator Framework                                 │
│  ├── Activity Manager                                       │
│  └── Package Manager                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 项目结构

```
RPAApp/
├── 📱 应用主体
│   ├── App.tsx                          # 主应用组件
│   ├── index.js                         # 应用入口
│   └── package.json                     # 依赖配置
│
├── 🔧 源代码 (src/)
│   ├── components/
│   │   └── ScriptExecutor.tsx           # 脚本执行器界面
│   ├── managers/
│   │   └── ScriptManager.ts             # 脚本管理器
│   ├── modules/
│   │   └── RPAServiceModule.ts          # 原生模块接口
│   └── types/
│       └── RPAServiceModule.ts          # TypeScript 类型定义
│
├── 🤖 Android 原生 (android/)
│   ├── app/src/main/java/com/rpaapp/
│   │   ├── RPAServiceModule.kt          # 原生模块实现
│   │   ├── UIAutomatorHelper.kt         # UI 自动化辅助
│   │   ├── RPAServicePackage.kt         # 模块包注册
│   │   └── MainApplication.kt           # 应用配置
│   ├── app/build.gradle                 # Android 构建配置
│   └── app/src/main/AndroidManifest.xml # 权限配置
│
├── 📜 示例脚本 (example-scripts/)
│   ├── advanced-automation.js           # 高级自动化流程
│   └── utility-functions.js             # 实用函数示例
│
└── 📚 文档
    ├── PROJECT_OVERVIEW.md              # 项目概览 (本文档)
    ├── DEVELOPMENT_COMMANDS.md          # 开发命令手册
    ├── SCRIPT_USAGE.md                  # 脚本使用指南
    └── RPA_MODULE_README.md             # 原生模块文档
```

---

## 🚀 核心功能模块

### 1. 原生 RPA 模块 (RPAServiceModule)

**位置**: `android/app/src/main/java/com/rpaapp/RPAServiceModule.kt`

**功能**:
- `start()` - 初始化 RPA 服务
- `launchSettings()` - 启动系统设置
- `launchWifiSettings()` - 启动 WiFi 设置
- `launchBluetoothSettings()` - 启动蓝牙设置
- `launchAppByPackage(packageName)` - 通过包名启动应用

**技术实现**:
- 使用 Android UI Automator 2.0 框架
- 支持 Promise 异步调用
- 完整的错误处理和日志记录

### 2. 脚本管理器 (ScriptManager)

**位置**: `src/managers/ScriptManager.ts`

**功能**:
- 脚本文件的增删改查
- 动态脚本执行引擎
- 安全沙箱环境
- 示例脚本自动生成

**技术特点**:
- 单例模式设计
- ES5 语法兼容性
- Function 构造器 (比 eval 更安全)
- Promise 异步支持

### 3. 脚本执行器界面 (ScriptExecutor)

**位置**: `src/components/ScriptExecutor.tsx`

**功能**:
- 可视化脚本管理界面
- 内置代码编辑器
- 实时执行状态显示
- 错误提示和成功反馈

**用户体验**:
- 模态窗口设计
- 直观的操作按钮
- 加载状态指示
- 友好的错误提示

---

## 🔧 开发工作流

### 快速开始
```bash
# 1. 安装依赖
npm install

# 2. 启动模拟器
emulator -avd Pixel_6 &

# 3. 构建并运行
npx react-native run-android
```

### 开发调试
```bash
# 查看日志
adb logcat -s ReactNativeJS:V

# 重新加载应用
adb shell input keyevent 82  # 打开开发者菜单
```

### 脚本开发
1. 在应用中点击 "📜 脚本执行器"
2. 点击 "创建示例" 生成示例脚本
3. 点击 "新建脚本" 创建自定义脚本
4. 使用内置编辑器编写脚本
5. 点击 "执行" 测试脚本功能

---

## 📋 脚本开发规范

### 语法要求
- ✅ 使用 ES5 兼容语法
- ✅ 使用 `var` 声明变量
- ✅ 使用 `function()` 而非箭头函数
- ✅ 使用字符串拼接而非模板字符串
- ✅ 使用 Promise 链式调用而非 async/await

### 示例脚本结构
```javascript
// 脚本说明注释
console.log("脚本开始执行");

// 同步操作示例
var result = "Hello World";
Alert.alert("提示", result);
return result;

// 异步操作示例
return new Promise(function(resolve, reject) {
  RPAServiceModule.launchSettings()
    .then(function(result) {
      console.log("成功: " + result);
      resolve(result);
    })
    .catch(function(error) {
      console.error("失败: " + error);
      reject(error);
    });
});
```

---

## 🔒 安全特性

### 沙箱环境
- 脚本在受控环境中执行
- 仅能访问预定义的 API
- 无法访问系统敏感功能
- 无法执行恶意代码

### 权限控制
- 应用仅请求必要权限
- UI Automator 权限受系统保护
- 脚本文件存储在应用私有目录

---

## 📈 性能优化

### JavaScript 引擎
- 使用 Hermes 引擎提升性能
- ES5 语法确保最佳兼容性
- Function 构造器避免 eval 性能问题

### 内存管理
- 脚本执行完成后自动清理
- 避免长时间运行的脚本
- 合理使用定时器和异步操作

---

## 🔮 扩展方向

### 短期目标
- [ ] 添加更多 UI Automator 操作
- [ ] 支持脚本调度和定时执行
- [ ] 增加脚本执行历史记录
- [ ] 优化脚本编辑器体验

### 长期规划
- [ ] 支持远程脚本同步
- [ ] 可视化脚本构建器
- [ ] 多设备协同自动化
- [ ] 云端脚本市场

---

## 📞 技术支持

### 相关文档
- [开发命令手册](./DEVELOPMENT_COMMANDS.md)
- [脚本使用指南](./SCRIPT_USAGE.md)
- [原生模块文档](./RPA_MODULE_README.md)

### 问题排查
1. 查看应用日志: `adb logcat -s ReactNativeJS:V`
2. 检查原生模块: `adb logcat | grep RPA`
3. 验证环境配置: `npx react-native doctor`

### 开发环境
- **Node.js**: v20.18.1
- **Java**: OpenJDK 17
- **Android SDK**: API Level 34
- **React Native**: 0.80.0

---

**🎉 恭喜！您现在拥有了一个功能完整的 RPA 自动化应用！** 
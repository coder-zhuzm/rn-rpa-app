# 🤖 RPA App - React Native 自动化应用

这是一个基于 React Native 的 RPA（机器人流程自动化）应用，支持动态脚本执行、Web
调试界面和 Android 设备自动化操作。

## 📚 文档导航

**🎯 快速导航**: [📚 完整文档索引](./DOCUMENTATION_INDEX.md) |
[🚀 快速开始](./QUICK_START.md) | [📁 目录结构](./DIRECTORY_STRUCTURE.md) |
[🔧 调试指南](./DEBUGGING_GUIDE.md)

### 📖 主要文档

- **[📚 文档索引](./DOCUMENTATION_INDEX.md)** - 所有文档的分类导航
- **[🚀 快速开始指南](./QUICK_START.md)** - 新用户快速上手
- **[📁 目录结构说明](./DIRECTORY_STRUCTURE.md)** - 项目文件结构详解
- **[💻 开发命令手册](./doc/DEVELOPMENT_COMMANDS.md)** - 构建、调试、设备管理命
  令
- **[📜 脚本使用指南](./doc/SCRIPT_USAGE.md)** - 动态脚本编写和使用
- **[🔧 调试指南](./DEBUGGING_GUIDE.md)** - 故障排除和问题解决
- **[🌐 Web 调试界面](./src/web-debug/README.md)** - Web 调试功能说明

---

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped
using
[`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the
> [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)
> guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React
Native.

To start the Metro dev server, run the following command from the root of your
React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React
Native project, and use one of the following commands to build and run your
Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run
on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install
CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit
[CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the
Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android
Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you
save, your app will automatically update and reflect these changes — this is
powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app,
you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the
  **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or
  <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application,
  check out the
  [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the
  [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the
[Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React
  Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an
  **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided
  tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native
  **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the
  Open Source; GitHub **repository** for React Native.

## 项目目录结构

```
RPAApp/
├── android/                # Android 原生代码
├── ios/                    # iOS 原生代码
├── src/                    # 源代码目录
│   ├── components/         # React 组件
│   │   └── ScriptExecutor.tsx  # 脚本执行器组件
│   ├── managers/           # 管理器类
│   │   └── ScriptManager.ts    # 脚本管理器
│   ├── modules/            # 模块定义
│   │   └── RPAServiceModule.ts # RPA服务模块接口
│   ├── services/           # 服务类
│   │   └── http/           # HTTP服务相关
│   │       └── HttpService.ts  # HTTP服务类
│   ├── types/              # 类型定义
│   └── web-debug/          # Web调试相关
│       ├── public/         # Web调试静态文件
│       │   └── index.html  # Web调试界面
│       ├── README_WEB_DEBUG.md # Web调试说明文档
│       ├── server.js       # Web调试服务器
│       └── start.js        # Web调试启动脚本
├── example-scripts/        # 示例脚本
├── test-scripts/           # 测试脚本
├── doc/                    # 文档
├── App.tsx                 # 应用入口
└── package.json            # 项目配置
```

## 使用方法

### 启动应用

```bash
# 安装依赖
npm install

# 启动Metro服务器
npm start

# 在Android设备上运行
npm run android
```

### 启动 Web 调试服务器

```bash
# 启动Web调试服务器
npm run web-debug
```

## 开发命令

### 代码质量检查

```bash
# 完整检查（类型、lint、格式、测试）
npm run check-all

# 自动修复所有可修复的问题
npm run fix-all

# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# 修复 import 排序
npm run lint:imports

# 代码格式化
npm run format

# 检查代码格式
npm run format:check

# TypeScript 类型检查
npm run type-check
```

### 测试相关

```bash
# 运行测试
npm test

# 监听模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### Android 构建

```bash
# 清理 Android 构建
npm run clean:android

# 构建 Release APK
npm run build:android

# 安装 APK 到设备
npm run install:android

# 清理并重新安装依赖
npm run clean
```

## Git 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 提交格式
<type>(<scope>): <subject>

# 示例
feat(http): 添加服务器健康检查功能
fix(ui): 修复重启按钮样式问题
docs: 更新 README 安装说明
```

### 自动化检查

每次提交前会自动运行：

- ESLint 检查和修复
- Prettier 格式化
- Import 排序
- TypeScript 类型检查
- 单元测试

如果检查失败，提交会被阻止。可以运行 `npm run fix-all` 自动修复大部分问题。

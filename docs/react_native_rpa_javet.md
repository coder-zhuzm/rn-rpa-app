# 📱 React Native + Javet (V8) RPA 系统开发文档

## 🧭 项目目标概述

构建一个基于 React Native 的 Android 应用，集成 Javet (V8 JS 引擎)，实现通过 JS 脚本操作 Android UI Automator 的能力，支持脚本远程分发、离线推送、本地执行与在线调试。

---

## 📐 技术架构

```
React Native
    │
    ├── RPAServiceModule（桥接模块）
    │      └── 调用 Native 功能（启动 V8 执行）
    │
    └── 远程任务调度、脚本触发

Native Android
    ├── V8 引擎托管（Javet）
    │      ├── 执行 JS 脚本（本地/远程）
    │      └── 注册原生函数供 JS 调用（如 clickByText）
    ├── 文件系统脚本管理
    └── UI Automator 操作封装
```

---

## 🧩 功能开发步骤

### ✅ 第1步：初始化 React Native + 原生模块
- 初始化 React Native 项目
- 创建 Android 原生模块 `RPAServiceModule`
- 暴露 `start()` 方法供 JS 调用，打印日志

### ✅ 第2步：封装 UI Automator 功能
- 在原生模块中加入 `launchSettings()` 方法，调用 UI Automator 启动系统设置
- 将其通过 Bridge 暴露给 JS

### ✅ 第3步：支持 JS 文件动态加载
- 使用 `react-native-fs` 加载本地脚本文件
- 使用 `eval()` 或 `Function` 执行字符串

### ✅ 第4步：支持 adb push 脚本文件
- 指定 App 可读目录（如 files/scripts）
- App 启动时扫描该目录加载可执行 JS 文件

### ✅ 第5步：Web 页面远程调试接口

- 创建一个网页：textarea + 执行按钮
- 网页调用本地 HTTP API，传入 JS 脚本内容
- App 执行收到的脚本

### ✅ 第6步：集成 Javet（V8 JS 引擎） 

- 在 Android 原生中添加 Javet 库
- 创建 `V8RPAEngine` 类
- 初始化 V8 Runtime，绑定函数（如 clickByText）
- 接收 JS 脚本并运行，返回执行结果
- React Native 通过模块调用该执行函数

### ✅ 第7步：实现保活脚本机制   【跳过实现】
- App 启动后自动执行 main.js
- 使用 AppState 或 Headless JS 支持冷启动执行

### ✅ 第8步：接入 HTTP / MQTT 接口 【跳过实现】
- 使用 `axios` 轮询 HTTP 脚本任务
- 接入 MQTT，订阅某个 topic（如 rpa/task）
- 收到 JS 脚本字符串即调用执行接口

---

## 📦 推荐 Monorepo 结构（使用 pnpm workspace）

```
my-rpa-project/
├── apps/
│   └── mobile/                 # React Native 项目
├── packages/
│   ├── rpa-core/              # 原生模块包装逻辑、通用脚本封装
│   ├── rpa-scripts/           # 示例脚本、调试脚本
│   └── rpa-web-controller/    # 网页控制端 (React/Next.js)
├── tools/
│   └── script-push-cli/       # CLI 工具：上传 JS 脚本到设备
├── .env
├── pnpm-workspace.yaml
└── README.md
```

---

## 📚 依赖工具和库

| 功能 | 推荐库 |
|------|--------|
| JS 文件读取 | `react-native-fs` |
| MQTT 客户端 | `mqtt` (JS)，`paho` (Web)，或原生客户端 |
| HTTP 请求 | `axios` |
| JS 引擎 | [Javet](https://github.com/caoccao/Javet) |
| 原生模块桥接 | `@react-native-community/native-module` 模板 |

---

## 🧪 示例脚本（main.js）
```js
// 被 V8 引擎执行
console.log("Script started");
clickByText("设置"); // 原生注入的函数
```

---

## 🚀 启动和调试方式

```bash
# adb 推送脚本
adb push ./scripts/main.js /data/data/<包名>/files/scripts/main.js

# 启动 App 后自动加载并执行

# Web 调试页面通过 POST 请求
curl -X POST http://<device-ip>:3000/exec \
     -H "Content-Type: text/plain" \
     --data-binary @scripts/test.js
```

---

## 📈 后续扩展建议
- ✅ 多任务调度队列（带并发和超时控制）
- ✅ 脚本沙箱机制，防止恶意代码
- ✅ JS 调试日志回传（MQTT 或 WebSocket）
- ✅ DSL（任务流程脚本语言）封装
- ✅ 脚本运行状态持久化与恢复

---

如需将该计划导入 Trello、Notion、或生成 CLI 初始化模板，也可继续定制。


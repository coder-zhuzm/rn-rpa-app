# 📁 项目目录结构说明

本文档详细说明了 RPA App 项目的目录结构和各文件的作用。

## 🌳 项目根目录结构

```
auto-rpa-app/
├── 📁 android/                    # Android 原生代码
├── 📁 src/                        # React Native 源代码
├── 📁 doc/                        # 项目文档
├── 📁 test-scripts/               # 测试脚本
├── 📁 __tests__/                  # 单元测试
├── 📁 __mocks__/                  # Jest Mock 文件
├── 📁 .vscode/                    # VSCode 配置
├── 📁 .husky/                     # Git hooks 配置
├── 📁 node_modules/               # 依赖包（自动生成）
├── 📄 package.json                # 项目配置和依赖
├── 📄 package-lock.json           # 依赖版本锁定
├── 📄 tsconfig.json               # TypeScript 配置
├── 📄 jest.config.js              # Jest 测试配置
├── 📄 .eslintrc.js                # ESLint 代码规范配置
├── 📄 .prettierrc.js              # Prettier 格式化配置
├── 📄 commitlint.config.js        # Git 提交规范配置
├── 📄 metro.config.js             # Metro 打包配置
├── 📄 babel.config.js             # Babel 转译配置
├── 📄 react-native.config.js      # React Native 配置
├── 📄 README.md                   # 项目说明
├── 📄 QUICK_START.md              # 快速开始指南
├── 📄 CODE_STANDARDS.md           # 代码规范文档
├── 📄 DEBUGGING_GUIDE.md          # 调试指南
├── 📄 ADB_PUSH_GUIDE.md           # ADB 推送指南
├── 📄 SCRIPT_ERROR_HANDLING.md    # 脚本错误处理
├── 📄 README_WEB_DEBUG.md         # Web 调试说明
├── 📄 HUSKY_AND_IMPORT_CONFIG.md  # Husky 配置指南
├── 📄 DIRECTORY_STRUCTURE.md      # 目录结构说明（本文档）
└── 📄 DOCUMENTATION_INDEX.md      # 文档索引
```

## 📂 详细目录说明

### 🤖 Android 原生代码 (`android/`)

```
android/
├── 📁 app/                        # 主应用模块
│   ├── 📁 src/main/
│   │   ├── 📁 java/com/rpaapp/    # Java/Kotlin 源代码
│   │   │   ├── 📄 MainActivity.java        # 主活动
│   │   │   ├── 📄 MainApplication.java     # 应用入口
│   │   │   └── 📁 rpa/                     # RPA 原生模块
│   │   │       ├── 📄 RPAModule.java       # RPA 功能模块
│   │   │       └── 📄 RPAPackage.java      # RPA 包注册
│   │   ├── 📁 res/                # Android 资源文件
│   │   └── 📄 AndroidManifest.xml # 应用清单文件
│   ├── 📄 build.gradle            # 应用构建配置
│   └── 📄 proguard-rules.pro      # 代码混淆规则
├── 📁 gradle/wrapper/             # Gradle 包装器
├── 📄 build.gradle                # 项目构建配置
├── 📄 gradle.properties           # Gradle 属性配置
├── 📄 gradlew                     # Gradle 包装器脚本（Unix）
├── 📄 gradlew.bat                 # Gradle 包装器脚本（Windows）
└── 📄 settings.gradle             # Gradle 设置
```

**关键文件说明**：

- `MainActivity.java`: React Native 应用的 Android 入口点
- `RPAModule.java`: 实现 RPA 自动化功能的原生模块
- `AndroidManifest.xml`: 定义应用权限和组件

### 📱 React Native 源代码 (`src/`)

```
src/
├── 📁 components/                 # React 组件
│   ├── 📄 ScriptEditor.tsx        # 脚本编辑器组件
│   ├── 📄 ScriptList.tsx          # 脚本列表组件
│   ├── 📄 LogViewer.tsx           # 日志查看器组件
│   └── 📄 StatusBar.tsx           # 状态栏组件
├── 📁 services/                   # 业务服务
│   ├── 📄 HttpService.ts          # HTTP 服务器服务
│   ├── 📄 ScriptService.ts        # 脚本管理服务
│   ├── 📄 FileService.ts          # 文件操作服务
│   ├── 📄 LogService.ts           # 日志服务
│   └── 📄 ScriptErrorAnalyzer.ts  # 脚本错误分析器
├── 📁 utils/                      # 工具函数
│   ├── 📄 constants.ts            # 常量定义
│   ├── 📄 helpers.ts              # 辅助函数
│   └── 📄 types.ts                # TypeScript 类型定义
├── 📁 web-debug/                  # Web 调试界面
│   ├── 📄 index.html              # Web 调试主页面
│   ├── 📄 script.js               # Web 调试脚本
│   ├── 📄 style.css               # Web 调试样式
│   └── 📄 README.md               # Web 调试说明
├── 📁 assets/                     # 静态资源
│   ├── 📁 images/                 # 图片资源
│   └── 📁 fonts/                  # 字体资源
└── 📄 App.tsx                     # 应用根组件
```

**关键文件说明**：

- `App.tsx`: React Native 应用的主入口组件
- `HttpService.ts`: 提供 HTTP 服务器功能，支持 Web 调试
- `ScriptService.ts`: 管理脚本的加载、执行和保存
- `ScriptErrorAnalyzer.ts`: 分析和处理脚本执行错误

### 📚 文档目录 (`doc/`)

```
doc/
├── 📄 PROJECT_OVERVIEW.md         # 项目概览
├── 📄 DEVELOPMENT_COMMANDS.md     # 开发命令手册
├── 📄 SCRIPT_USAGE.md             # 脚本使用指南
└── 📄 RPA_MODULE_README.md        # RPA 模块文档
```

### 🧪 测试相关

```
__tests__/
├── 📄 App.test.tsx                # 应用组件测试
├── 📄 ScriptService.test.ts       # 脚本服务测试
└── 📄 HttpService.test.ts         # HTTP 服务测试

__mocks__/
├── 📄 @react-native-community/    # React Native 社区模块 Mock
├── 📄 react-native-fs.js          # 文件系统模块 Mock
└── 📄 react-native-http-bridge.js # HTTP 桥接模块 Mock

test-scripts/
├── 📄 README.md                   # 测试脚本说明
├── 📄 basic-test.js               # 基础功能测试脚本
├── 📄 ui-automation.js            # UI 自动化测试脚本
└── 📄 network-test.js             # 网络功能测试脚本
```

### ⚙️ 配置文件

```
.vscode/
├── 📄 settings.json               # VSCode 工作区设置
└── 📄 launch.json                 # 调试配置

.husky/
├── 📄 pre-commit                  # 提交前钩子
└── 📄 commit-msg                  # 提交信息钩子
```

## 🔧 重要配置文件详解

### 📦 `package.json`

项目的核心配置文件，包含：

- 项目基本信息（名称、版本、描述）
- 依赖包列表（dependencies 和 devDependencies）
- NPM 脚本命令
- React Native 和 TypeScript 配置

### 🔍 `tsconfig.json`

TypeScript 编译配置：

- 编译选项（target、module、lib 等）
- 路径映射（baseUrl、paths）
- 类型检查严格性设置

### 🎨 `.eslintrc.js`

ESLint 代码规范配置：

- 继承的规则集（@react-native、TypeScript）
- 自定义规则
- 文件类型特殊配置

### 💅 `.prettierrc.js`

Prettier 代码格式化配置：

- 缩进、引号、分号等格式规则
- 不同文件类型的覆盖设置

### 🚀 `metro.config.js`

Metro 打包工具配置：

- 文件解析规则
- 转换器配置
- 资源处理

## 📁 目录使用指南

### 🆕 添加新功能

1. **React 组件**: 在 `src/components/` 添加新组件
2. **业务逻辑**: 在 `src/services/` 添加服务类
3. **工具函数**: 在 `src/utils/` 添加辅助函数
4. **原生功能**: 在 `android/app/src/main/java/com/rpaapp/` 添加原生模块

### 🧪 添加测试

1. **单元测试**: 在 `__tests__/` 添加对应的测试文件
2. **Mock 文件**: 在 `__mocks__/` 添加模块 Mock
3. **测试脚本**: 在 `test-scripts/` 添加功能测试脚本

### 📝 添加文档

1. **功能文档**: 在 `doc/` 添加详细说明
2. **使用指南**: 在根目录添加用户指南
3. **更新索引**: 在 `DOCUMENTATION_INDEX.md` 中添加链接

## 🔍 文件查找技巧

### 按功能查找

- **HTTP 服务**: `src/services/HttpService.ts`
- **脚本管理**: `src/services/ScriptService.ts`
- **错误处理**: `src/services/ScriptErrorAnalyzer.ts`
- **Web 调试**: `src/web-debug/`
- **原生 RPA**: `android/app/src/main/java/com/rpaapp/rpa/`

### 按文件类型查找

- **配置文件**: 根目录的 `.js`、`.json` 文件
- **文档文件**: 根目录和 `doc/` 目录的 `.md` 文件
- **测试文件**: `__tests__/` 目录的 `.test.ts` 文件
- **脚本文件**: `test-scripts/` 目录的 `.js` 文件

## 📋 维护建议

### 🧹 定期清理

- 删除未使用的文件和依赖
- 清理构建产物（`android/app/build/`）
- 更新过时的文档

### 📊 结构优化

- 保持目录结构清晰
- 避免深层嵌套
- 按功能模块组织代码

### 📚 文档同步

- 新增功能时同步更新文档
- 保持目录结构文档的准确性
- 定期检查文档链接的有效性

---

**最后更新**: 2024 年 12 月 **维护者**: RPA App 开发团队

# 📚 GitHub Actions 学习指南

## 🎯 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的 CI/CD（持续集成/持续部署）平台，可以自动化你的软件开发工作流程。

## 🏗️ 核心概念

### 1. Workflow（工作流）
- **定义**: 一个自动化的过程，由一个或多个任务组成
- **文件位置**: `.github/workflows/` 目录下的 YAML 文件
- **触发**: 由特定事件触发执行

### 2. Event（事件）
触发工作流的活动，常见事件：
- `push` - 推送代码
- `pull_request` - 创建或更新PR
- `schedule` - 定时触发
- `workflow_dispatch` - 手动触发
- `release` - 发布版本

### 3. Job（任务）
- 工作流中的一组步骤
- 在同一个运行器上执行
- 可以并行或串行执行
- 可以有依赖关系

### 4. Step（步骤）
- 任务中的单个操作
- 可以运行命令或使用Action
- 按顺序执行

### 5. Action（动作）
- 可重用的代码单元
- 可以是自己写的，也可以使用社区的
- 通过 `uses` 关键字调用

### 6. Runner（运行器）
- 执行工作流的服务器
- GitHub 提供托管运行器
- 也可以使用自托管运行器

## 📝 基本语法

### 工作流文件结构
```yaml
name: 工作流名称

on: 触发事件

env: 环境变量

jobs:
  job-id:
    name: 任务名称
    runs-on: 运行环境
    steps:
      - name: 步骤名称
        run: 命令
```

### 触发条件示例
```yaml
on:
  # 推送到特定分支
  push:
    branches: [ main, develop ]
  
  # PR到特定分支
  pull_request:
    branches: [ main ]
  
  # 定时触发（每天8点）
  schedule:
    - cron: '0 8 * * *'
  
  # 手动触发
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
```

## 🔧 常用功能

### 1. 环境变量
```yaml
# 全局环境变量
env:
  NODE_VERSION: '18'
  
jobs:
  build:
    # 任务级环境变量
    env:
      BUILD_TYPE: 'production'
    
    steps:
      - name: 使用环境变量
        env:
          # 步骤级环境变量
          STEP_VAR: 'value'
        run: |
          echo "Node版本: $NODE_VERSION"
          echo "构建类型: $BUILD_TYPE"
          echo "步骤变量: $STEP_VAR"
```

### 2. 条件执行
```yaml
steps:
  - name: 只在主分支执行
    if: github.ref == 'refs/heads/main'
    run: echo "这是主分支"
  
  - name: 只在PR时执行
    if: github.event_name == 'pull_request'
    run: echo "这是PR"
  
  - name: 失败时执行
    if: failure()
    run: echo "前面的步骤失败了"
  
  - name: 总是执行
    if: always()
    run: echo "无论成功失败都执行"
```

### 3. 矩阵构建
```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
        exclude:
          - os: windows-latest
            node-version: 16
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### 4. 任务依赖
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "构建中..."
  
  test:
    needs: build  # 依赖build任务
    runs-on: ubuntu-latest
    steps:
      - run: echo "测试中..."
  
  deploy:
    needs: [build, test]  # 依赖多个任务
    runs-on: ubuntu-latest
    steps:
      - run: echo "部署中..."
```

### 5. 输出和共享数据
```yaml
jobs:
  job1:
    outputs:
      output1: ${{ steps.step1.outputs.value }}
    steps:
      - id: step1
        run: echo "value=hello" >> $GITHUB_OUTPUT
  
  job2:
    needs: job1
    steps:
      - run: echo "获取到的值: ${{ needs.job1.outputs.output1 }}"
```

## 🛠️ 常用 Actions

### 1. 检出代码
```yaml
- name: 检出代码
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # 获取完整历史
```

### 2. 设置环境
```yaml
# Node.js
- name: 设置 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'

# Java
- name: 设置 JDK
  uses: actions/setup-java@v4
  with:
    java-version: '11'
    distribution: 'temurin'

# Python
- name: 设置 Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.9'
```

### 3. 缓存依赖
```yaml
- name: 缓存 npm 依赖
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 4. 上传/下载文件
```yaml
# 上传构建产物
- name: 上传 APK
  uses: actions/upload-artifact@v4
  with:
    name: app-release
    path: app/build/outputs/apk/release/*.apk
    retention-days: 30

# 下载构建产物
- name: 下载 APK
  uses: actions/download-artifact@v4
  with:
    name: app-release
    path: ./downloads
```

## 🎯 实际应用场景

### 1. 代码质量检查
```yaml
name: 代码质量检查

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run prettier:check
      - run: npm run type-check
```

### 2. 自动化测试
```yaml
name: 自动化测试

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - name: 上传覆盖率报告
        uses: codecov/codecov-action@v3
```

### 3. 构建和发布
```yaml
name: 构建和发布

on:
  push:
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 构建 Android APK
        run: |
          cd android
          ./gradlew assembleRelease
      - name: 创建发布
        uses: softprops/action-gh-release@v1
        with:
          files: android/app/build/outputs/apk/release/*.apk
```

## 🔍 调试技巧

### 1. 启用调试日志
```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

### 2. 使用 tmate 进行远程调试
```yaml
- name: 远程调试
  if: failure()
  uses: mxschmitt/action-tmate@v3
  timeout-minutes: 30
```

### 3. 输出详细信息
```yaml
- name: 调试信息
  run: |
    echo "事件: ${{ github.event_name }}"
    echo "分支: ${{ github.ref }}"
    echo "提交: ${{ github.sha }}"
    echo "工作目录: $(pwd)"
    echo "环境变量:"
    env | sort
```

## 📊 最佳实践

### 1. 安全性
- 使用 Secrets 存储敏感信息
- 限制 token 权限
- 定期更新 Actions 版本

### 2. 性能优化
- 使用缓存减少构建时间
- 并行执行独立任务
- 合理设置超时时间

### 3. 可维护性
- 使用有意义的名称
- 添加详细的注释
- 模块化复杂的工作流

### 4. 错误处理
- 使用 `continue-on-error` 处理非关键步骤
- 添加失败通知
- 保存调试信息

## 🚀 学习建议

1. **从简单开始**: 先创建一个简单的 "Hello World" 工作流
2. **逐步增加功能**: 慢慢添加更多的步骤和功能
3. **查看日志**: 仔细阅读执行日志，理解每个步骤
4. **参考示例**: 查看其他项目的工作流文件
5. **实践练习**: 在自己的项目中尝试不同的配置

## 📚 相关资源

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions)
- [GitHub Actions 社区](https://github.community/c/code-to-cloud/github-actions)

---

## 🎯 你的学习路径

基于你的 RPA 项目，建议按以下顺序学习：

1. **基础概念** ✅ - 运行 `learn-actions.yml` 了解基本概念
2. **代码检查** - 学习如何集成 ESLint、Prettier
3. **Android 构建** - 学习如何构建 APK
4. **自动化测试** - 集成单元测试和集成测试
5. **部署发布** - 学习如何自动发布到 GitHub Releases
6. **高级功能** - 学习矩阵构建、条件执行等

现在你可以：
1. 提交这些文件到 GitHub
2. 在 Actions 页面查看工作流执行
3. 尝试手动触发工作流
4. 修改配置并观察变化 
# 🚀 GitHub Actions 快速指南

## 🐛 常见问题解决

### 1. npm 缓存错误
**错误信息**: `Some specified paths were not resolved, unable to cache dependencies`

**原因**: `setup-node` 的自动缓存功能在某些情况下无法正确识别 `package-lock.json` 路径

**解决方案**: 使用手动缓存
```yaml
- name: 🟢 设置 Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    # 不使用自动缓存

- name: 📦 缓存 npm 依赖
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 2. 路径问题
**问题**: 在 monorepo 或子目录项目中，路径引用容易出错

**解决方案**: 
- 使用 `working-directory` 指定工作目录
- 使用相对路径时要注意当前位置
```yaml
- name: 安装依赖
  working-directory: auto-rpa-app  # 指定工作目录
  run: npm ci

- name: 缓存依赖
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('auto-rpa-app/package-lock.json') }}
```

### 3. 权限问题
**问题**: Actions 可能没有足够权限执行某些操作

**解决方案**: 在 workflow 中添加权限设置
```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write
```

## 📝 最佳实践

### 1. 缓存策略
```yaml
# npm 缓存
- name: 缓存 npm 依赖
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# Gradle 缓存
- name: 缓存 Gradle
  uses: actions/cache@v3
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: gradle-${{ runner.os }}-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
```

### 2. 条件执行
```yaml
# 只在特定分支执行
- name: 部署到生产环境
  if: github.ref == 'refs/heads/main'
  run: echo "部署中..."

# 只在 PR 时执行
- name: 运行额外检查
  if: github.event_name == 'pull_request'
  run: echo "PR 检查中..."

# 失败时执行
- name: 清理资源
  if: failure()
  run: echo "清理中..."
```

### 3. 错误处理
```yaml
# 允许步骤失败但继续执行
- name: 可选的检查
  continue-on-error: true
  run: npm run optional-check

# 设置超时
- name: 长时间运行的任务
  timeout-minutes: 30
  run: npm run long-task
```

## 🔧 调试技巧

### 1. 启用调试日志
在 workflow 中添加：
```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

### 2. 输出调试信息
```yaml
- name: 调试信息
  run: |
    echo "当前目录: $(pwd)"
    echo "文件列表:"
    ls -la
    echo "环境变量:"
    env | sort
    echo "Node 版本: $(node --version)"
    echo "npm 版本: $(npm --version)"
```

### 3. 检查文件是否存在
```yaml
- name: 检查文件
  run: |
    if [ -f "package.json" ]; then
      echo "✅ package.json 存在"
      cat package.json | head -10
    else
      echo "❌ package.json 不存在"
    fi
```

## 🎯 你的项目修复

我已经修复了你的 Actions 配置：

1. **移除了有问题的自动缓存**
2. **添加了手动 npm 缓存**
3. **保持了所有功能不变**

现在你的 Actions 应该可以正常运行了！

## 📊 验证修复

提交更改后，你可以：
1. 查看 Actions 页面的执行日志
2. 确认缓存步骤成功执行
3. 验证依赖安装正常

如果还有问题，检查：
- `package-lock.json` 文件是否存在
- 路径是否正确
- 权限是否足够 
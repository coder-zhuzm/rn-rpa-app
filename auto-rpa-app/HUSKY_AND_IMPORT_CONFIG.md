# Husky 和 Import 自动排序配置指南

## 📋 概述

本项目配置了完整的代码质量保障体系，包括：

- **Husky**: Git hooks 自动化
- **ESLint**: 代码质量检查和自动修复
- **Prettier**: 代码格式化
- **Import 自动排序**: 统一的导入语句组织
- **TypeScript**: 类型检查
- **Jest**: 单元测试

## 🔧 Husky 配置详解

### Pre-commit Hook (`.husky/pre-commit`)

每次提交前自动执行以下检查：

```bash
# 1. 代码格式化和ESLint检查
npx lint-staged

# 2. TypeScript 类型检查
npx tsc --noEmit

# 3. 单元测试
npm test -- --watchAll=false --passWithNoTests

# 4. 文件大小检查
find . -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" | xargs wc -l
```

### Commit Message Hook (`.husky/commit-msg`)

验证提交信息格式符合 Conventional Commits 规范：

```bash
npx --no -- commitlint --edit $1
```

## 📦 Lint-staged 配置

在 `package.json` 中配置的 `lint-staged` 规则：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --rule 'import/order: [error, {...}]'",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": ["prettier --write"],
    "*.{ts,tsx}": ["bash -c 'tsc --noEmit'"]
  }
}
```

## 🔄 Import 自动排序配置

### ESLint Import Order 规则

在 `.eslintrc.js` 中配置的导入排序规则：

```javascript
'import/order': [
  'error',
  {
    groups: [
      'builtin',    // Node.js 内置模块
      'external',   // 第三方库
      'internal',   // 内部模块
      'parent',     // 父级目录
      'sibling',    // 同级目录
      'index'       // index 文件
    ],
    'newlines-between': 'always',  // 组之间空行
    alphabetize: {
      order: 'asc',           // 字母升序
      caseInsensitive: true   // 忽略大小写
    }
  }
]
```

### 导入排序示例

**正确的导入顺序：**

```typescript
// 1. 第三方库 (external)
import NetInfo from '@react-native-community/netinfo';
import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';

// 2. 内部模块 (internal)
import { ScriptExecutor } from './src/components/ScriptExecutor';
import RPAServiceModule from './src/modules/RPAServiceModule';
import { ServiceManager } from './src/services/ServiceManager';
```

## 🛠️ 可用的 NPM 脚本

### 代码质量检查

```bash
# 完整检查（类型、lint、格式、测试）
npm run check-all

# 自动修复所有可修复的问题
npm run fix-all

# 只修复 import 排序
npm run lint:imports

# ESLint 检查和修复
npm run lint
npm run lint:fix

# 代码格式化
npm run format
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
```

## 🎯 VSCode 自动配置

### 保存时自动操作

在 `.vscode/settings.json` 中配置：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit", // 自动修复 ESLint 问题
    "source.organizeImports": "explicit", // 自动排序导入
    "source.removeUnusedImports": "explicit" // 移除未使用导入
  }
}
```

### TypeScript 导入设置

```json
{
  "typescript.preferences.organizeImportsIgnoreCase": false,
  "typescript.preferences.organizeImportsCollation": "ordinal",
  "typescript.preferences.organizeImportsNumericCollation": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

## 🚀 使用流程

### 1. 开发时

- 保存文件时自动格式化和修复
- VSCode 会自动排序导入语句
- ESLint 会实时提示问题

### 2. 提交前

```bash
# 方式一：手动运行完整检查
npm run check-all

# 方式二：自动修复后提交
npm run fix-all
git add .
git commit -m "feat: 添加新功能"

# 方式三：直接提交（husky 会自动检查）
git add .
git commit -m "feat: 添加新功能"
```

### 3. 如果检查失败

```bash
# 自动修复大部分问题
npm run fix-all

# 手动修复剩余问题
# 重新提交
git add .
git commit -m "feat: 添加新功能"
```

## 🔍 故障排除

### 常见问题

1. **Import 顺序错误**

   ```bash
   npm run lint:imports
   ```

2. **格式化问题**

   ```bash
   npm run format
   ```

3. **TypeScript 错误**

   ```bash
   npm run type-check
   ```

4. **测试失败**
   ```bash
   npm run test:watch
   ```

### 跳过 Hooks（紧急情况）

```bash
# 跳过 pre-commit 检查
git commit -m "fix: 紧急修复" --no-verify

# 跳过 commit-msg 检查
git commit -m "emergency fix" --no-verify
```

## 📚 相关文档

- [ESLint Import Plugin](https://github.com/import-js/eslint-plugin-import)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [TypeScript Import Organization](https://www.typescriptlang.org/docs/handbook/modules.html)

## 🎉 最佳实践

1. **提交前检查**: 始终运行 `npm run check-all`
2. **小步提交**: 频繁提交小的更改
3. **描述性提交**: 使用清晰的提交信息
4. **测试驱动**: 编写测试并确保通过
5. **代码审查**: 提交前自我审查代码质量

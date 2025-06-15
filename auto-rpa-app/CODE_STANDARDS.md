# 📋 代码规范文档

本文档定义了 RPA App 项目的代码规范和开发流程标准。

## 🎯 目录

- [代码格式化](#-代码格式化)
- [ESLint 规则](#-eslint-规则)
- [Git 提交规范](#-git-提交规范)
- [TypeScript 规范](#-typescript-规范)
- [React Native 规范](#-react-native-规范)
- [文件命名规范](#-文件命名规范)
- [开发工具配置](#-开发工具配置)

## 🎨 代码格式化

### Prettier 配置

项目使用 Prettier 进行代码格式化，配置如下：

```javascript
// .prettierrc.js
{
  printWidth: 100,        // 行宽限制
  tabWidth: 2,           // 缩进宽度
  useTabs: false,        // 使用空格
  semi: true,            // 语句末尾分号
  singleQuote: true,     // 使用单引号
  jsxSingleQuote: false, // JSX中使用双引号
  trailingComma: 'all',  // 尾随逗号
  bracketSpacing: true,  // 对象括号间空格
  arrowParens: 'avoid',  // 箭头函数参数括号
}
```

### 格式化命令

```bash
# 格式化所有文件
npm run format

# 检查格式化
npm run format:check
```

## 🔍 ESLint 规则

### 主要规则类别

1. **TypeScript 规则**

   - 禁止使用 `any` 类型（警告）
   - 必须声明未使用的变量（错误）
   - 优先使用 `const`（错误）

2. **React 规则**

   - 正确使用 React Hooks（错误）
   - 避免在 JSX 中使用 bind（警告）
   - 使用 PascalCase 命名组件（错误）

3. **React Native 规则**

   - 移除未使用的样式（错误）
   - 避免内联样式（警告）
   - 避免颜色字面量（警告）

4. **Import 规则**
   - 导入顺序规范（错误）
   - 禁止循环依赖（错误）
   - 自动移除未使用的导入（错误）
   - 按组分类并字母排序
   - 组间自动添加空行

### 检查命令

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复可修复的问题
npm run lint:fix

# 修复 import 排序
npm run lint:imports

# TypeScript 类型检查
npm run type-check

# 完整检查（类型、lint、格式、测试）
npm run check-all

# 自动修复所有可修复的问题
npm run fix-all
```

## 📝 Git 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型 (type)

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建相关
- `ci`: CI/CD 相关
- `chore`: 其他杂项
- `rpa`: RPA 功能相关（项目特定）
- `android`: Android 平台相关
- `web`: Web 调试相关

### 作用域 (scope) - 可选

- `http`: HTTP 服务相关
- `ui`: 用户界面
- `script`: 脚本执行
- `config`: 配置相关
- `deps`: 依赖更新

### 示例

```bash
# 好的提交信息
feat(http): 添加服务器健康检查功能
fix(ui): 修复重启按钮样式问题
docs: 更新 README 安装说明
rpa(script): 优化脚本执行错误处理

# 不好的提交信息
update code
fix bug
add feature
```

### Git Hooks

项目配置了以下 Git Hooks：

1. **pre-commit**: 运行代码检查和格式化
2. **commit-msg**: 检查提交信息格式

## 📘 TypeScript 规范

### 类型定义

```typescript
// ✅ 好的做法
interface User {
  id: number;
  name: string;
  email?: string;
}

// ❌ 避免使用 any
const userData: any = {};

// ✅ 使用具体类型
const userData: User = {
  id: 1,
  name: 'John',
};
```

### 函数定义

```typescript
// ✅ 明确的参数和返回类型
function processUser(user: User): Promise<boolean> {
  return Promise.resolve(true);
}

// ✅ 箭头函数
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

### 导入导出

```typescript
// ✅ 正确的导入顺序（自动排序）
import NetInfo from '@react-native-community/netinfo'; // 第三方库
import React, { useState, useEffect } from 'react'; // 第三方库
import { View, Text, Alert } from 'react-native'; // 第三方库

import { ScriptExecutor } from './components/ScriptExecutor'; // 内部模块
import { HttpService } from './services/HttpService'; // 内部模块
import { User, UserRole } from './types/User'; // 内部模块

// ✅ 默认导出
export default class RPAService {
  // ...
}

// ✅ 命名导出
export { HttpService, ScriptManager };
```

### Import 排序规则

导入语句按以下顺序自动排序：

1. **builtin**: Node.js 内置模块
2. **external**: 第三方库（npm 包）
3. **internal**: 内部模块（项目内文件）
4. **parent**: 父级目录文件
5. **sibling**: 同级目录文件
6. **index**: index 文件

每个组内按字母顺序排列，组间自动添加空行。

## 📱 React Native 规范

### 组件定义

```typescript
// ✅ 函数组件
interface Props {
  title: string;
  onPress?: () => void;
}

const CustomButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

### 样式定义

```typescript
// ✅ StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
});

// ❌ 避免内联样式
<View style={{ flex: 1, backgroundColor: 'red' }} />;
```

### Hooks 使用

```typescript
// ✅ 正确的 Hook 使用
const [isLoading, setIsLoading] = useState<boolean>(false);
const [data, setData] = useState<User[]>([]);

useEffect(() => {
  fetchData();
}, []);

// ✅ 自定义 Hook
const useHttpService = () => {
  const [service] = useState(() => HttpService.getInstance());
  return service;
};
```

## 📁 文件命名规范

### 目录结构

```
src/
├── components/          # React 组件
│   ├── common/         # 通用组件
│   └── screens/        # 页面组件
├── services/           # 服务类
├── utils/              # 工具函数
├── types/              # 类型定义
├── hooks/              # 自定义 Hooks
└── constants/          # 常量定义
```

### 文件命名

- **组件文件**: PascalCase (e.g., `UserProfile.tsx`)
- **服务文件**: PascalCase (e.g., `HttpService.ts`)
- **工具文件**: camelCase (e.g., `formatUtils.ts`)
- **类型文件**: PascalCase (e.g., `User.ts`)
- **常量文件**: camelCase (e.g., `apiConstants.ts`)

### 导出规范

```typescript
// ✅ 组件文件 - 默认导出
export default UserProfile;

// ✅ 服务文件 - 命名导出
export { HttpService };

// ✅ 类型文件 - 命名导出
export interface User {
  // ...
}
export type UserRole = 'admin' | 'user';

// ✅ 工具文件 - 命名导出
export const formatDate = (date: Date): string => {
  // ...
};
```

## 🛠️ 开发工具配置

### VSCode 设置

项目包含了 VSCode 工作区配置 (`.vscode/settings.json`)：

#### 保存时自动操作

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit", // 自动修复 ESLint 问题
    "source.organizeImports": "explicit", // 自动排序导入
    "source.removeUnusedImports": "explicit" // 移除未使用导入
  },
  "editor.formatOnSave": true // 保存时自动格式化
}
```

#### TypeScript 增强配置

```json
{
  "typescript.preferences.organizeImportsIgnoreCase": false,
  "typescript.preferences.organizeImportsCollation": "ordinal",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.suggest.autoImports": true
}
```

#### 功能特性

- 自动格式化保存
- ESLint 自动修复
- Import 自动排序
- TypeScript 智能提示
- 文件关联配置
- 移除未使用导入

### 推荐扩展

必装扩展：

- ESLint
- Prettier
- React Native Tools
- TypeScript Importer

可选扩展：

- GitLens
- Material Icon Theme
- Todo Tree
- Better Comments

### 开发流程

1. **开发前**

   ```bash
   git pull origin main
   npm install
   ```

2. **开发中**

   - 遵循代码规范
   - 及时提交小的改动
   - 使用有意义的提交信息

3. **提交前**

   ```bash
   # 方式一：手动运行检查
   npm run check-all

   # 方式二：自动修复后提交
   npm run fix-all
   git add .
   git commit -m "feat: 添加新功能"

   # 方式三：直接提交（husky 会自动检查）
   git add .
   git commit -m "feat: 添加新功能"
   ```

4. **推送前**
   ```bash
   git push origin feature-branch
   ```

## 🚀 自动化检查

### Pre-commit 检查

每次提交前自动运行（通过 Husky）：

1. **代码格式化和 ESLint 检查** (lint-staged)

   - ESLint 自动修复
   - Prettier 格式化
   - Import 排序

2. **TypeScript 类型检查**

   - `tsc --noEmit` 验证类型

3. **单元测试**

   - Jest 测试运行

4. **文件大小检查**
   - 检测大文件警告

### Commit 信息检查

每次提交时自动检查提交信息格式是否符合规范。

### 持续集成

建议在 CI/CD 流程中添加：

- 代码质量检查
- 单元测试
- 构建验证

## 📚 参考资源

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [React Native Style Guide](https://github.com/facebook/react-native)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

遵循这些规范将帮助我们维护高质量、一致性的代码库，提高团队协作效率。

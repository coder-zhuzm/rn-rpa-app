# 脚本错误处理指南

## 概述

RPA 应用现在提供了强大的脚本错误分析和展示功能，帮助您快速定位和解决脚本执行问题
。

## 错误展示功能

### 🔍 错误分析器 (ScriptErrorAnalyzer)

错误分析器能够智能识别和分类各种类型的脚本错误：

- **语法错误**: 检测 JavaScript 语法问题
- **运行时错误**: 识别变量、函数、属性访问错误
- **RPA 相关错误**: 特定于 RPA 模块的错误
- **系统错误**: 其他系统级错误

### 📊 错误报告生成

对于每个错误，系统会生成包含以下信息的详细报告：

1. **错误类别**: 错误的具体分类
2. **错误描述**: 错误的详细说明
3. **解决建议**: 具体的修复建议
4. **示例代码**: 正确和错误的代码示例
5. **相关文档**: 相关的帮助文档链接

### 🎨 可视化错误展示

在应用中，错误会通过 `ErrorDisplay` 组件进行可视化展示：

- **颜色编码**: 使用红色主题突出显示错误
- **分段显示**: 错误信息分类展示，易于理解
- **交互功能**: 可以查看详细堆栈、完整报告等
- **关闭选项**: 可以手动关闭错误展示

## 常见错误类型和解决方案

### 1. 语法错误

#### 意外的符号 (Unexpected token)

```javascript
// ❌ 错误
console.log("Hello World";

// ✅ 正确
console.log("Hello World");
```

#### 代码不完整 (Unexpected end of input)

```javascript
// ❌ 错误
if (condition) {
  console.log("test");

// ✅ 正确
if (condition) {
  console.log("test");
}
```

### 2. 运行时错误

#### 变量未定义 (is not defined)

```javascript
// ❌ 错误
console.log(undefinedVariable);

// ✅ 正确
const message = 'Hello';
console.log(message);
```

#### 属性访问错误 (Cannot read property)

```javascript
// ❌ 错误
const obj = null;
console.log(obj.property);

// ✅ 正确
const obj = { property: 'value' };
console.log(obj?.property);
```

#### 函数调用错误 (is not a function)

```javascript
// ❌ 错误
const notAFunction = 'string';
notAFunction();

// ✅ 正确
const myFunction = () => 'result';
myFunction();
```

### 3. RPA 相关错误

#### 模块未定义

```javascript
// ❌ 错误 (模块名拼写错误)
RPAModule.launchSettings();

// ✅ 正确
RPAServiceModule.launchSettings();
```

#### 权限错误

```javascript
// 确保无障碍服务已启用
// 检查应用权限设置
await RPAServiceModule.launchSettings();
```

## 调试技巧

### 1. 使用控制台输出

```javascript
console.log('开始执行脚本');
console.log('变量值:', someVariable);
console.log('执行到这里了');
```

### 2. 分步执行

将复杂脚本分解为小步骤，逐步测试：

```javascript
// 步骤1: 启动应用
const result1 = await RPAServiceModule.launchAppByPackage('com.example.app');
console.log('步骤1完成:', result1);

// 步骤2: 等待加载
await new Promise(resolve => setTimeout(resolve, 2000));
console.log('步骤2完成: 等待完成');

// 步骤3: 执行操作
await RPAServiceModule.clickByText('按钮');
console.log('步骤3完成: 点击按钮');
```

### 3. 错误处理

```javascript
try {
  // 可能出错的代码
  await RPAServiceModule.someOperation();
} catch (error) {
  console.error('操作失败:', error.message);
  // 处理错误或返回默认值
}
```

### 4. 类型检查

```javascript
// 检查变量是否存在
if (typeof RPAServiceModule !== 'undefined') {
  await RPAServiceModule.launchSettings();
} else {
  console.error('RPA模块未加载');
}

// 检查函数是否存在
if (typeof RPAServiceModule.clickByText === 'function') {
  await RPAServiceModule.clickByText('按钮');
}
```

## 错误处理最佳实践

### 1. 预防性编程

- 在使用变量前检查其是否存在
- 为函数参数提供默认值
- 使用可选链操作符 `?.`

### 2. 渐进式开发

- 从简单脚本开始
- 逐步添加复杂功能
- 每步都进行测试

### 3. 充分的日志记录

- 在关键步骤添加日志
- 记录变量的值和状态
- 使用有意义的日志消息

### 4. 错误恢复

- 为关键操作添加重试机制
- 提供备用执行路径
- 优雅地处理失败情况

## 如何获取帮助

1. **查看错误展示**: 仔细阅读错误分析和建议
2. **检查示例代码**: 参考提供的正确代码示例
3. **查看调试指南**: 参考 `DEBUGGING_GUIDE.md`
4. **测试小片段**: 在浏览器控制台中测试代码片段
5. **查看完整报告**: 使用"查看完整报告"按钮获取详细信息

## 示例脚本

### 基础测试脚本

```javascript
// 简单的测试脚本
console.log('脚本开始执行');

// 检查RPA模块
if (typeof RPAServiceModule !== 'undefined') {
  console.log('RPA模块可用');
} else {
  console.log('RPA模块不可用');
}

return '测试完成';
```

### RPA 操作脚本

```javascript
// RPA操作示例
try {
  // 启动设置应用
  console.log('启动设置...');
  await RPAServiceModule.launchSettings();

  // 等待应用加载
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 查找并点击特定文本
  await RPAServiceModule.clickByText('关于手机');

  return '设置操作完成';
} catch (error) {
  console.error('操作失败:', error.message);
  return '操作失败: ' + error.message;
}
```

## 总结

新的错误处理系统提供了：

- 🔍 智能错误分析
- 📊 详细错误报告
- 🎨 可视化错误展示
- 💡 具体解决建议
- 📚 代码示例和文档

通过使用这些功能，您可以更快地识别和解决脚本问题，提高开发效率。

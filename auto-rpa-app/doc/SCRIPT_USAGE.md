# RPA App 动态脚本使用指南

## 📖 概述

RPA App 支持动态加载和执行 JavaScript 脚本，让您可以灵活地创建和运行自动化任务。
脚本在安全的沙箱环境中执行，可以访问 RPA 原生模块的所有功能。

## 🚀 快速开始

### 1. 打开脚本执行器

- 在主界面点击 "📜 脚本执行器" 按钮
- 脚本执行器将以模态窗口形式打开

### 2. 创建示例脚本

- 点击 "创建示例" 按钮
- 系统会自动创建几个示例脚本供您学习

### 3. 执行脚本

- 在脚本列表中选择要执行的脚本
- 点击 "执行" 按钮
- 查看执行结果和日志输出

## 📝 脚本编写指南

### 基本结构

```javascript
// 脚本开头的注释说明
console.log('脚本开始执行');

// 同步执行示例
return '脚本执行完成';

// 异步执行示例
return new Promise(async (resolve, reject) => {
  try {
    // 执行异步操作
    const result = await RPAServiceModule.launchSettings();
    resolve(result);
  } catch (error) {
    reject(error);
  }
});
```

### 可用的上下文对象

脚本执行时可以访问以下对象：

#### RPAServiceModule

原生 RPA 模块，提供以下方法：

- `start()` - 启动 RPA 服务
- `launchSettings()` - 启动系统设置
- `launchWifiSettings()` - 启动 WiFi 设置
- `launchBluetoothSettings()` - 启动蓝牙设置
- `launchAppByPackage(packageName)` - 通过包名启动应用

#### console

标准控制台对象，用于日志输出：

- `console.log(message)` - 输出普通日志
- `console.error(message)` - 输出错误日志
- `console.warn(message)` - 输出警告日志

#### Alert

React Native 的 Alert 组件：

- `Alert.alert(title, message)` - 显示提示框

#### 内置对象

- `JSON` - JSON 处理
- `Math` - 数学函数
- `Date` - 日期时间
- `String`, `Number`, `Boolean` - 基本类型
- `Array`, `Object` - 集合类型
- `Promise` - 异步处理
- `setTimeout`, `setInterval` - 定时器

## 📚 脚本示例

### 1. Hello World 脚本

```javascript
// Hello World 示例脚本
console.log('Hello from RPA Script!');
Alert.alert('脚本执行', 'Hello World 脚本执行成功！');
return 'Hello World executed successfully';
```

### 2. 启动应用脚本

```javascript
// 启动系统设置示例脚本
console.log('正在启动系统设置...');

return new Promise(async (resolve, reject) => {
  try {
    const result = await RPAServiceModule.launchSettings();
    console.log('设置启动结果:', result);
    Alert.alert('成功', result);
    resolve(result);
  } catch (error) {
    console.error('启动设置失败:', error);
    Alert.alert('错误', '启动设置失败: ' + error);
    reject(error);
  }
});
```

### 3. 自动化序列脚本

```javascript
// 自动化序列示例脚本
console.log('开始执行自动化序列...');

return new Promise(async (resolve, reject) => {
  try {
    // 1. 启动 RPA 服务
    console.log('1. 初始化 RPA 服务');
    RPAServiceModule.start();

    // 等待一秒
    await new Promise(r => setTimeout(r, 1000));

    // 2. 启动 WiFi 设置
    console.log('2. 启动 WiFi 设置');
    const wifiResult = await RPAServiceModule.launchWifiSettings();
    console.log('WiFi 设置结果:', wifiResult);

    // 等待两秒
    await new Promise(r => setTimeout(r, 2000));

    // 3. 启动蓝牙设置
    console.log('3. 启动蓝牙设置');
    const bluetoothResult = await RPAServiceModule.launchBluetoothSettings();
    console.log('蓝牙设置结果:', bluetoothResult);

    Alert.alert('完成', '自动化序列执行完成！');
    resolve('自动化序列执行成功');
  } catch (error) {
    console.error('自动化序列执行失败:', error);
    Alert.alert('错误', '自动化序列执行失败: ' + error);
    reject(error);
  }
});
```

## 🔧 高级功能

### 1. 错误处理

```javascript
return new Promise(async (resolve, reject) => {
  try {
    // 可能出错的操作
    const result = await RPAServiceModule.launchSettings();
    resolve(result);
  } catch (error) {
    console.error('操作失败:', error);
    Alert.alert('错误', `操作失败: ${error}`);
    reject(error);
  }
});
```

### 2. 进度跟踪

```javascript
const tasks = ['任务1', '任务2', '任务3'];

for (let i = 0; i < tasks.length; i++) {
  console.log(`执行进度: ${i + 1}/${tasks.length} - ${tasks[i]}`);
  // 执行任务...
  await new Promise(r => setTimeout(r, 1000));
}
```

### 3. 条件执行

```javascript
const currentHour = new Date().getHours();

if (currentHour >= 9 && currentHour <= 17) {
  console.log('工作时间，执行工作相关任务');
  await RPAServiceModule.launchSettings();
} else {
  console.log('非工作时间，跳过任务');
  Alert.alert('提示', '当前为非工作时间');
}
```

## 📁 文件管理

### 脚本存储位置

脚本文件存储在应用的文档目录中：

```
/data/data/com.rpaapp/files/Documents/rpa-scripts/
```

### 文件命名规范

- 脚本文件必须以 `.js` 扩展名结尾
- 建议使用有意义的文件名，如 `launch-settings.js`
- 避免使用特殊字符和空格

### 脚本管理操作

- **创建**: 点击 "新建脚本" 按钮
- **编辑**: 点击脚本项目的 "编辑" 按钮
- **删除**: 点击脚本项目的 "删除" 按钮
- **刷新**: 点击 "刷新" 按钮重新加载脚本列表

## ⚠️ 注意事项

### 安全限制

- 脚本在沙箱环境中执行，无法访问系统敏感功能
- 不能执行恶意代码或访问其他应用数据
- 仅能使用预定义的 API 和对象

### 性能考虑

- 避免编写无限循环或长时间运行的脚本
- 合理使用 `setTimeout` 和 `setInterval`
- 大量数据处理时注意内存使用

### 调试技巧

- 使用 `console.log()` 输出调试信息
- 通过 `Alert.alert()` 显示关键状态
- 查看 Android 日志获取详细错误信息

## 🔍 故障排除

### 常见问题

1. **脚本执行失败**

   - 检查语法错误
   - 确认 API 调用正确
   - 查看错误日志

2. **原生方法调用失败**

   - 确认设备权限设置
   - 检查目标应用是否已安装
   - 验证包名是否正确

3. **脚本无法保存**
   - 检查文件名是否有效
   - 确认存储权限
   - 重启应用后重试

### 获取帮助

- 查看应用日志输出
- 检查示例脚本的实现
- 参考本文档的示例代码

## 🎯 最佳实践

1. **代码组织**

   - 使用清晰的注释说明脚本功能
   - 将复杂逻辑拆分为小函数
   - 保持代码简洁易读

2. **错误处理**

   - 始终使用 try-catch 包装异步操作
   - 提供有意义的错误消息
   - 优雅地处理失败情况

3. **用户体验**

   - 提供执行进度反馈
   - 使用 Alert 显示重要结果
   - 记录详细的执行日志

4. **测试验证**
   - 在不同设备上测试脚本
   - 验证边界条件和异常情况
   - 确保脚本的可重复执行

---

通过以上指南，您可以充分利用 RPA App 的动态脚本功能，创建强大的自动化解决方案！

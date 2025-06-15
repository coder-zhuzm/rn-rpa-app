# 测试脚本目录

## 📋 概述

这个目录包含了所有用于测试 RPA App 功能的脚本文件。所有测试脚本都使用 ES5 语法编
写，确保与 React Native 的 Hermes 引擎兼容。

## 📁 目录结构

```
test-scripts/
├── README.md                    # 本说明文档
├── test-adb-push.sh            # ADB 推送测试工具
├── test-external-script.js     # 外部脚本基础测试
├── wifi-settings-script.js     # WiFi 设置启动测试
├── automation-sequence.js      # 自动化序列测试
└── [更多测试脚本...]
```

## 🧪 测试脚本说明

### 1. test-external-script.js

**功能**: 外部脚本基础功能测试

- ✅ 测试 adb push 脚本加载
- ✅ 测试 RPA 服务启动
- ✅ 测试应用启动功能（计算器）
- ✅ 测试异步操作和 Promise 处理
- ✅ 测试用户界面反馈（Alert）

**使用场景**: 验证外部脚本的基本功能是否正常工作

### 2. wifi-settings-script.js

**功能**: WiFi 设置页面启动测试

- ✅ 测试系统设置页面访问
- ✅ 测试 UI Automator 功能
- ✅ 测试 Promise 链式调用
- ✅ 测试错误处理机制

**使用场景**: 验证应用能否正确启动系统 WiFi 设置页面

### 3. automation-sequence.js

**功能**: 复杂自动化序列测试

- ✅ 测试多步骤自动化流程
- ✅ 测试递归 Promise 调用
- ✅ 测试步骤间的时序控制
- ✅ 测试复杂的错误处理
- ✅ 测试状态管理和进度跟踪

**使用场景**: 验证复杂自动化任务的执行能力

### 4. test-adb-push.sh

**功能**: ADB 推送测试自动化工具

- ✅ 自动检查设备连接状态
- ✅ 自动创建外部脚本目录
- ✅ 批量推送测试脚本
- ✅ 自动重启应用加载脚本
- ✅ 提供调试命令提示

**使用场景**: 快速部署和测试外部脚本功能

## 🚀 使用方法

### 快速测试流程

```bash
# 1. 进入测试脚本目录
cd test-scripts

# 2. 运行自动化测试工具
chmod +x test-adb-push.sh
./test-adb-push.sh

# 3. 在应用中测试脚本
# - 启动 RPA App
# - 点击 "脚本执行器"
# - 选择 [外部] 标签的脚本
# - 执行并观察结果
```

### 手动推送单个脚本

```bash
# 推送特定脚本
adb -s emulator-5554 push test-external-script.js /sdcard/rpa-scripts/

# 重启应用加载脚本
adb -s emulator-5554 shell am force-stop com.rpaapp
adb -s emulator-5554 shell am start -n com.rpaapp/.MainActivity
```

### 查看执行日志

```bash
# 实时查看应用日志
adb -s emulator-5554 logcat -s ReactNativeJS

# 过滤特定日志
adb -s emulator-5554 logcat -s ReactNativeJS | grep "脚本"
```

## 📝 脚本编写规范

### 基本模板

```javascript
// 脚本名称和功能描述
// 测试目标: [具体测试的功能]

console.log('🧪 [脚本名称] 开始执行');
console.log('测试目标: [功能描述]');
console.log('执行时间:', new Date().toLocaleString());

// 测试逻辑
try {
  // 主要测试代码
  var result = RPAServiceModule.someFunction();
  console.log('✅ 测试成功:', result);

  // 用户反馈
  Alert.alert('测试结果', '功能测试通过: ' + result);

  // 返回结果
  return Promise.resolve(result);
} catch (error) {
  console.error('❌ 测试失败:', error);
  Alert.alert('测试失败', '错误信息: ' + error);
  return Promise.reject(error);
}
```

### 命名规范

- **基础功能测试**: `test-[功能名].js`
- **UI 操作测试**: `ui-[操作名].js`
- **自动化流程测试**: `automation-[流程名].js`
- **性能测试**: `performance-[测试项].js`
- **错误处理测试**: `error-[场景名].js`

## 🔧 调试技巧

### 1. 添加详细日志

```javascript
console.log('=== 测试开始 ===');
console.log('脚本版本: 1.0');
console.log('测试环境:', typeof RPAServiceModule);
console.log('可用方法:', Object.keys(RPAServiceModule || {}));

// 你的测试代码

console.log('=== 测试结束 ===');
```

### 2. 错误捕获

```javascript
function safeExecute(testFunction, testName) {
  try {
    console.log('开始执行:', testName);
    var result = testFunction();
    console.log('执行成功:', testName, result);
    return result;
  } catch (error) {
    console.error('执行失败:', testName, error);
    Alert.alert('测试失败', testName + ' 失败: ' + error);
    throw error;
  }
}
```

### 3. 性能监控

```javascript
var startTime = Date.now();

// 你的测试代码

var endTime = Date.now();
var duration = endTime - startTime;
console.log('执行耗时:', duration + 'ms');
```

## 📊 测试覆盖范围

### 已覆盖功能

- ✅ RPA 服务启动
- ✅ 系统设置页面访问
- ✅ WiFi 设置页面访问
- ✅ 蓝牙设置页面访问
- ✅ 应用启动（通过包名）
- ✅ 外部脚本加载
- ✅ Promise 异步处理
- ✅ 错误处理机制
- ✅ 用户界面反馈

### 待添加测试

- ⏳ 更多系统设置页面
- ⏳ 复杂 UI 交互
- ⏳ 文件系统操作
- ⏳ 网络请求处理
- ⏳ 性能压力测试
- ⏳ 边界条件测试

## 🛠️ 故障排除

### 常见问题

1. **脚本不显示在列表中**

   - 检查文件是否成功推送: `adb shell ls -la /sdcard/rpa-scripts/`
   - 重启应用:
     `adb shell am force-stop com.rpaapp && adb shell am start -n com.rpaapp/.MainActivity`

2. **脚本执行失败**

   - 查看日志: `adb logcat -s ReactNativeJS`
   - 检查语法: 确保使用 ES5 语法
   - 验证权限: 确保应用有存储权限

3. **设备连接问题**
   - 检查设备: `adb devices`
   - 重启 ADB: `adb kill-server && adb start-server`

### 测试环境要求

- ✅ Android 模拟器或真机
- ✅ ADB 工具可用
- ✅ RPA App 已安装
- ✅ 存储权限已授予
- ✅ USB 调试已启用

---

通过这个统一的测试脚本目录，您可以更好地管理和测试 RPA App 的各项功能！🧪

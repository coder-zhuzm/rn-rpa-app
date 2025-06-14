# ADB Push 脚本功能使用指南

## 📋 概述

RPA App 支持通过 `adb push` 命令直接推送 JavaScript 脚本文件到设备，应用会自动扫描并加载这些外部脚本。这个功能让开发者可以快速测试和部署自动化脚本，无需重新构建应用。

## 🎯 功能特性

- ✅ **外部脚本目录**: `/sdcard/rpa-scripts/`
- ✅ **自动扫描**: 应用启动时自动扫描外部脚本
- ✅ **实时加载**: 推送新脚本后刷新应用即可使用
- ✅ **脚本标识**: 外部脚本在列表中显示 `[外部]` 标签
- ✅ **权限支持**: 自动处理存储权限

## 📁 目录结构

```
设备存储结构:
├── /sdcard/rpa-scripts/          # 外部脚本目录 (adb push)
│   ├── test-external-script.js
│   ├── wifi-settings-script.js
│   └── automation-sequence.js
└── /data/data/com.rpaapp/files/
    └── rpa-scripts/              # 内部脚本目录 (应用内置)
        ├── hello-world.js
        ├── system-settings.js
        └── ...
```

## 🚀 使用方法

### 1. 创建外部脚本目录

```bash
# 在设备上创建外部脚本目录
adb shell mkdir -p /sdcard/rpa-scripts
```

### 2. 推送脚本文件

```bash
# 推送单个脚本
adb push your-script.js /sdcard/rpa-scripts/

# 推送多个脚本
adb push script1.js script2.js /sdcard/rpa-scripts/

# 推送整个目录
adb push ./scripts/ /sdcard/rpa-scripts/
```

### 3. 验证推送结果

```bash
# 查看推送的脚本文件
adb shell ls -la /sdcard/rpa-scripts/
```

### 4. 在应用中使用

1. 启动 RPA App
2. 点击 "脚本执行器" 按钮
3. 在脚本列表中找到 `[外部]` 标签的脚本
4. 选择并执行脚本

## 📝 脚本编写规范

### 基本结构

```javascript
// 脚本描述注释
// 通过 adb push 推送的外部脚本

console.log("🚀 脚本开始执行");
console.log("脚本来源: adb push");

// 你的自动化逻辑
RPAServiceModule.start();

// 返回 Promise (可选)
return new Promise(function(resolve, reject) {
  // 异步操作
  setTimeout(function() {
    console.log("脚本执行完成");
    resolve("执行成功");
  }, 1000);
});
```

### 可用的 API

```javascript
// RPA 服务模块
RPAServiceModule.start()                           // 启动 RPA 服务
RPAServiceModule.launchSettings()                  // 启动系统设置
RPAServiceModule.launchWifiSettings()              // 启动 WiFi 设置
RPAServiceModule.launchBluetoothSettings()         // 启动蓝牙设置
RPAServiceModule.launchAppByPackage(packageName)   // 启动指定应用

// 全局对象
console.log()                                      // 控制台输出
Alert.alert(title, message)                       // 显示弹窗
setTimeout(callback, delay)                        // 延时执行
Promise                                            // Promise 支持
```

### 语法要求

⚠️ **重要**: 脚本必须使用 ES5 语法，不支持 ES6+ 特性：

```javascript
// ✅ 正确的 ES5 语法
var message = "Hello World";
function myFunction() {
  return "result";
}

// ❌ 不支持的 ES6+ 语法
const message = "Hello World";        // 使用 var 替代
let count = 0;                        // 使用 var 替代
() => {}                              // 使用 function() {} 替代
`template ${string}`                  // 使用 "string" + variable 替代
async/await                           // 使用 Promise.then() 替代
```

## 📋 示例脚本

### 1. 基础测试脚本

```javascript
// test-external-script.js
console.log("🚀 外部脚本开始执行");
console.log("脚本来源: adb push");

RPAServiceModule.start();

return RPAServiceModule.launchAppByPackage('com.android.calculator2')
  .then(function(result) {
    Alert.alert("测试完成", "计算器启动成功: " + result);
    return result;
  });
```

### 2. WiFi 设置脚本

```javascript
// wifi-settings-script.js
console.log("🔧 WiFi 设置脚本开始执行");

return RPAServiceModule.launchWifiSettings()
  .then(function(result) {
    Alert.alert("WiFi 设置", "WiFi 设置已启动！");
    return result;
  });
```

### 3. 自动化序列脚本

```javascript
// automation-sequence.js
console.log("🤖 自动化序列开始执行");

var steps = ["启动服务", "打开设置", "启动计算器"];
var currentStep = 0;

function executeNextStep() {
  if (currentStep >= steps.length) {
    Alert.alert("完成", "自动化序列执行完成！");
    return Promise.resolve("完成");
  }
  
  var step = steps[currentStep++];
  console.log("执行步骤: " + step);
  
  // 根据步骤执行不同操作
  switch (currentStep) {
    case 1: return Promise.resolve(RPAServiceModule.start());
    case 2: return RPAServiceModule.launchSettings();
    case 3: return RPAServiceModule.launchAppByPackage('com.android.calculator2');
    default: return Promise.resolve("未知步骤");
  }
}

// 递归执行所有步骤
function runSequence() {
  return executeNextStep().then(function(result) {
    if (currentStep < steps.length) {
      return runSequence();
    }
    return result;
  });
}

return runSequence();
```

## 🔧 开发工作流

### 快速开发流程

```bash
# 1. 编写脚本
vim my-automation.js

# 2. 推送到设备
adb push my-automation.js /sdcard/rpa-scripts/

# 3. 在应用中测试
# (无需重新构建应用)

# 4. 修改脚本
vim my-automation.js

# 5. 重新推送
adb push my-automation.js /sdcard/rpa-scripts/

# 6. 刷新应用测试
```

### 批量脚本管理

```bash
# 创建本地脚本目录
mkdir external-scripts
cd external-scripts

# 编写多个脚本
echo "console.log('Script 1');" > script1.js
echo "console.log('Script 2');" > script2.js

# 批量推送
adb push . /sdcard/rpa-scripts/

# 清理远程脚本
adb shell rm -rf /sdcard/rpa-scripts/*
```

## 🛠️ 故障排除

### 常见问题

1. **权限被拒绝**
   ```bash
   # 确保设备已授予存储权限
   adb shell pm grant com.rpaapp android.permission.WRITE_EXTERNAL_STORAGE
   adb shell pm grant com.rpaapp android.permission.READ_EXTERNAL_STORAGE
   ```

2. **脚本不显示**
   ```bash
   # 检查文件是否推送成功
   adb shell ls -la /sdcard/rpa-scripts/
   
   # 重启应用
   adb shell am force-stop com.rpaapp
   adb shell am start -n com.rpaapp/.MainActivity
   ```

3. **脚本执行失败**
   ```bash
   # 查看应用日志
   adb logcat -s ReactNativeJS
   ```

### 调试技巧

```javascript
// 在脚本中添加详细日志
console.log("=== 脚本开始 ===");
console.log("当前时间:", new Date().toLocaleString());
console.log("脚本参数:", arguments);

try {
  // 你的代码
  var result = RPAServiceModule.start();
  console.log("操作成功:", result);
} catch (error) {
  console.error("操作失败:", error);
  Alert.alert("错误", "脚本执行失败: " + error);
}

console.log("=== 脚本结束 ===");
```

## 📚 最佳实践

1. **脚本命名**: 使用描述性的文件名，如 `wifi-settings.js`、`app-launcher.js`
2. **错误处理**: 始终添加 try-catch 和 Promise.catch() 处理
3. **日志记录**: 添加详细的 console.log 便于调试
4. **用户反馈**: 使用 Alert.alert() 提供执行结果反馈
5. **代码注释**: 添加清晰的注释说明脚本功能
6. **测试验证**: 推送前在本地验证脚本语法

## 🔄 版本控制

```bash
# 使用 Git 管理脚本
git init external-scripts
cd external-scripts

# 添加脚本文件
git add *.js
git commit -m "Add automation scripts"

# 推送到设备
adb push . /sdcard/rpa-scripts/
```

---

通过 adb push 功能，您可以快速迭代和测试自动化脚本，大大提高开发效率！🚀 
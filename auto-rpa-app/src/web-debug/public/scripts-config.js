// RPA 示例脚本配置文件
// 在这里统一管理所有示例脚本，方便修改和扩充

window.RPAScripts = {
  // 系统设置相关脚本
  launchSettings: {
    name: '打开系统设置',
    description: '打开Android系统设置界面',
    category: '系统设置',
    script: `console.log('打开系统设置');
RPAServiceModule.launchSettings();
return '打开系统设置成功 ✅';`,
  },

  launchWifiSettings: {
    name: '打开WiFi设置',
    description: '打开WiFi设置界面',
    category: '系统设置',
    script: `console.log('打开 WiFi 设置');
RPAServiceModule.launchWifiSettings();
return 'WiFi 设置已打开 ✅';`,
  },

  launchBluetoothSettings: {
    name: '打开蓝牙设置',
    description: '打开蓝牙设置界面',
    category: '系统设置',
    script: `console.log('打开蓝牙设置');
RPAServiceModule.launchBluetoothSettings();
return '蓝牙设置已打开 ✅';`,
  },

  // 应用启动相关脚本
  launchAppByPackage: {
    name: '打开指定包名的应用',
    description: '通过包名启动指定的Android应用',
    category: '应用管理',
    script: `console.log('打开指定包名的应用');
// 请将下面的包名替换为实际的应用包名
const packageName = 'com.android.calculator2'; // 计算器
RPAServiceModule.launchAppByPackage(packageName);
return '打开应用 ' + packageName + ' 成功 ✅';`,
  },

  launchBrowser: {
    name: '打开浏览器',
    description: '启动系统默认浏览器',
    category: '应用管理',
    script: `console.log('打开浏览器');
const browserPackage = 'com.android.browser'; // 或其他浏览器包名
RPAServiceModule.launchAppByPackage(browserPackage);
return '浏览器已启动 ✅';`,
  },

  launchQQ: {
    name: '打开QQ应用',
    description: '启动腾讯QQ手机应用',
    category: '应用管理',
    script: `console.log('打开QQ应用');
const qqPackage = 'com.tencent.mobileqq';
RPAServiceModule.launchAppByPackage(qqPackage);
return '打开应用 ' + qqPackage + ' 成功 ✅';`,
  },

  launchWeChat: {
    name: '打开微信应用',
    description: '启动腾讯微信手机应用',
    category: '应用管理',
    script: `console.log('打开微信应用');
const wechatPackage = 'com.tencent.mm';
RPAServiceModule.launchAppByPackage(wechatPackage);
return '打开应用 ' + wechatPackage + ' 成功 ✅';`,
  },

  // 复合操作示例
  customExample: {
    name: '自定义示例脚本',
    description: '演示如何编写复杂的RPA脚本',
    category: '复合操作',
    script: `console.log('开始执行自定义脚本');

// 这是一个复合操作的示例
try {
    // 步骤1: 打开WiFi设置
    console.log('步骤1: 打开WiFi设置');
    RPAServiceModule.launchWifiSettings();
    
    // 可以在这里添加更多操作
    // 比如: 等待、点击、输入等
    // await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    
    return '自定义脚本执行成功 ✅';
} catch (error) {
    console.error('脚本执行出错:', error);
    return '脚本执行失败: ' + error.message + ' ❌';
}`,
  },

  multiStepExample: {
    name: '多步骤操作示例',
    description: '演示多个连续操作的执行',
    category: '复合操作',
    script: `console.log('开始多步骤操作');

try {
    let results = [];
    
    // 步骤1
    console.log('执行步骤1: 打开系统设置');
    RPAServiceModule.launchSettings();
    results.push('✅ 系统设置已打开');
    
    // 可以添加延时
    // await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 步骤2
    console.log('执行步骤2: 打开WiFi设置');
    RPAServiceModule.launchWifiSettings();
    results.push('✅ WiFi设置已打开');
    
    return '多步骤操作完成:\\n' + results.join('\\n');
} catch (error) {
    return '操作失败: ' + error.message + ' ❌';
}`,
  },

  // 可以继续添加更多脚本分类...

  // 测试脚本
  helloWorld: {
    name: 'Hello World',
    description: '简单的测试脚本',
    category: '测试',
    script: `console.log('Hello from RPA!');
return 'Hello World! 脚本执行成功 ✅';`,
  },

  // 设备信息获取脚本（如果有相关API）
  // getDeviceInfo: {
  //     name: '获取设备信息',
  //     description: '获取当前设备的基本信息',
  //     category: '设备信息',
  //     script: `console.log('获取设备信息');
  // // 假设有获取设备信息的API
  // // const deviceInfo = RPAServiceModule.getDeviceInfo();
  // return '设备信息获取完成 ✅';`
  // }
};

// 辅助函数：按分类获取脚本
window.getScriptsByCategory = function (category) {
  const scripts = window.RPAScripts;
  const result = {};
  for (const [key, script] of Object.entries(scripts)) {
    if (script.category === category) {
      result[key] = script;
    }
  }
  return result;
};

// 辅助函数：获取所有分类
window.getScriptCategories = function () {
  const scripts = window.RPAScripts;
  const categories = new Set();
  for (const script of Object.values(scripts)) {
    categories.add(script.category);
  }
  return Array.from(categories);
};

// 辅助函数：搜索脚本
window.searchScripts = function (keyword) {
  const scripts = window.RPAScripts;
  const result = {};
  const lowerKeyword = keyword.toLowerCase();

  for (const [key, script] of Object.entries(scripts)) {
    if (
      script.name.toLowerCase().includes(lowerKeyword) ||
      script.description.toLowerCase().includes(lowerKeyword)
    ) {
      result[key] = script;
    }
  }
  return result;
};

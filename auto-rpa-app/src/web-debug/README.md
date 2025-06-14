# RPA Web 调试界面

这是一个用于远程调试RPA应用的Web界面，支持脚本执行和管理。

## 文件结构

```
src/web-debug/
├── public/
│   ├── index.html          # 主界面文件
│   ├── scripts-config.js   # 脚本配置文件
├── server.js              # Node.js代理服务器
└── README.md              # 本文档
```

## 脚本管理系统

### 脚本配置文件 (`scripts-config.js`)

所有示例脚本都在 `scripts-config.js` 文件中统一管理，每个脚本包含以下属性：

- `name`: 脚本显示名称
- `description`: 脚本描述
- `category`: 脚本分类
- `script`: 实际的JavaScript代码

### 添加新脚本

要添加新的示例脚本，请编辑 `scripts-config.js` 文件：

```javascript
window.RPAScripts = {
    // 现有脚本...
    
    // 添加新脚本
    yourNewScript: {
        name: '你的脚本名称',
        description: '脚本功能描述',
        category: '脚本分类',
        script: `console.log('你的脚本代码');
// 在这里编写具体的RPA操作
RPAServiceModule.someMethod();
return '执行结果信息 ✅';`
    }
};
```

### 在界面中显示新脚本

1. 在 `index.html` 的示例脚本区域添加新按钮：

```html
<div class="example-item" data-script-key="yourNewScript">
    你的脚本名称
</div>
```

2. `data-script-key` 属性值必须与 `scripts-config.js` 中的键名一致。

### 脚本分类

当前支持的脚本分类：
- `系统设置`: 系统相关操作
- `应用管理`: 应用启动和管理
- `复合操作`: 多步骤复杂操作
- `测试`: 测试和演示脚本

可以根据需要添加新的分类。

### 辅助功能

`scripts-config.js` 提供了一些辅助函数：

- `getScriptsByCategory(category)`: 按分类获取脚本
- `getScriptCategories()`: 获取所有分类
- `searchScripts(keyword)`: 按关键词搜索脚本

## 使用方式

### 基本操作

1. **连接设备**: 输入RPA设备的IP地址和端口，点击"检查连接"
2. **选择脚本**: 点击示例脚本按钮加载预定义脚本
3. **执行脚本**: 点击"执行脚本"按钮运行代码
4. **查看结果**: 在结果区域查看执行结果

### 高级功能

- **双击执行**: 双击示例脚本按钮可直接执行（无需手动点击执行按钮）
- **自定义脚本**: 可以在文本框中直接编写和测试自定义脚本
- **代理连接**: 如果直连失败，可使用代理连接模式

## 脚本编写指南

### RPA API 使用

脚本中可以使用 `RPAServiceModule` 对象调用RPA功能：

```javascript
// 打开系统设置
RPAServiceModule.launchSettings();

// 打开WiFi设置
RPAServiceModule.launchWifiSettings();

// 打开蓝牙设置
RPAServiceModule.launchBluetoothSettings();

// 通过包名启动应用
RPAServiceModule.launchAppByPackage('com.example.app');
```

### 错误处理

建议在脚本中加入错误处理：

```javascript
try {
    // 你的RPA操作
    RPAServiceModule.someOperation();
    return '操作成功 ✅';
} catch (error) {
    console.error('操作失败:', error);
    return `操作失败: ${error.message} ❌`;
}
```

### 返回值规范

- 成功时返回包含 ✅ 的成功信息
- 失败时返回包含 ❌ 的错误信息
- 复杂结果可以返回对象或JSON字符串

## 故障排除

### 连接问题

1. 确保RPA应用已启动且HTTP服务器运行
2. 检查设备IP地址和端口是否正确
3. 确保设备和电脑在同一网络
4. 尝试使用代理连接模式

### 脚本执行问题

1. 检查脚本语法是否正确
2. 确认使用的RPA API是否存在
3. 查看浏览器控制台的错误信息
4. 检查设备端的日志输出

### 中文显示问题

如果出现中文乱码，系统会自动使用Unicode转义处理，无需手动处理。

## 扩展开发

### 添加新的RPA功能

1. 在RPA应用端添加新的原生方法
2. 在 `scripts-config.js` 中创建对应的示例脚本
3. 在 `index.html` 中添加对应的界面按钮
4. 测试功能完整性

### 自定义界面样式

可以修改 `index.html` 中的CSS样式来自定义界面外观。

### 添加新的连接方式

可以在 `index.html` 中添加新的连接方法，或者修改 `server.js` 来支持不同的代理策略。 
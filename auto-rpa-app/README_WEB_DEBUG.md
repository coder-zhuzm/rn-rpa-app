# RPA Web 远程调试界面

这个功能允许你通过 Web 界面远程调试和控制 RPA 应用。

## 功能特点

- 通过 Web 界面编写和执行 JavaScript 脚本
- 实时查看脚本执行结果
- 预设常用脚本示例
- 支持自定义服务器地址
- 显示设备IP地址，方便连接
- 提供代理连接功能，解决跨域问题

## 使用步骤

### 1. 启动 RPA 应用

首先，确保 RPA 应用已经在设备上运行，并且 HTTP 服务器已启动：

1. 在 Android 设备上运行 RPA 应用
2. 点击"启动 HTTP 服务器"按钮
3. 记下显示的设备IP地址和端口号（默认为 8080）

### 2. 启动 Web 调试服务器

在开发环境中，运行以下命令启动 Web 调试服务器：

```bash
cd RPAApp
npm run web-debug
```

这将在 http://localhost:3001 启动 Web 调试界面。

### 3. 连接到 RPA 应用

在 Web 界面中有三种连接方式：

#### 方式一：直接连接

1. 输入 RPA 应用的 HTTP 服务器地址，格式为 `http://<设备IP>:8080`
2. 点击"检查连接"按钮，确认连接状态

#### 方式二：XHR连接

1. 输入 RPA 应用的 HTTP 服务器地址，格式为 `http://<设备IP>:8080`
2. 点击"测试XHR连接"按钮，确认连接状态

#### 方式三：代理连接（推荐）

如果遇到连接失败或跨域问题，推荐使用此方式：

1. 输入 RPA 应用的 HTTP 服务器地址，格式为 `http://<设备IP>:8080`
2. 点击"使用代理连接"按钮
3. 连接成功后，所有请求将通过代理发送，避免跨域问题

### 4. 编写和执行脚本

1. 在文本区域中编写 JavaScript 脚本
2. 点击"执行脚本"按钮
3. 查看执行结果

你也可以点击预设的示例脚本，快速加载常用功能。

## 脚本示例

以下是一些可以在远程调试界面中使用的脚本示例：

### 打开系统设置

```javascript
console.log('Hello from RPA!');
RPAServiceModule.launchSettings();
return '打开系统设置成功';
```

### 打开 WiFi 设置

```javascript
console.log('启动 WiFi 设置');
RPAServiceModule.launchWifiSettings();
return 'WiFi 设置已打开';
```

### 打开蓝牙设置

```javascript
console.log('启动蓝牙设置');
RPAServiceModule.launchBluetoothSettings();
return '蓝牙设置已打开';
```

### 启动计算器

```javascript
console.log('启动计算器');
RPAServiceModule.launchAppByPackage('com.android.calculator2');
return '计算器已启动';
```

## 故障排除

如果连接失败，请尝试以下步骤：

1. 确保 RPA 应用正在运行且 HTTP 服务器已启动
2. 检查设备 IP 地址是否正确（可在 RPA 应用主界面查看）
3. 确保设备和电脑在同一网络中
4. 尝试使用"使用代理连接"按钮通过代理连接
5. 检查浏览器控制台是否有错误信息
6. 如果使用模拟器，尝试使用 10.0.2.2 替代 localhost

## 技术说明

### 架构

Web 调试界面由两部分组成：

1. **Web 服务器**：提供静态文件服务和代理功能
   - 运行在开发机器上，端口为 3001
   - 提供 HTML、CSS、JavaScript 文件
   - 提供代理功能，解决跨域请求问题

2. **RPA 应用 HTTP 服务器**：
   - 运行在 Android 设备上，端口为 8080
   - 接收脚本执行请求
   - 返回执行结果

### 代理功能

为解决浏览器跨域请求限制，Web 服务器提供了代理功能：

- 代理端点：`/proxy/[目标URL]`
- 例如：`/proxy/192.168.31.203:8080/status`

通过代理发送请求可以避免浏览器的跨域限制，确保连接成功。

## 注意事项

1. 确保 Android 设备和运行 Web 调试界面的计算机在同一网络中
2. 如果连接失败，请检查：
   - RPA 应用是否正在运行
   - HTTP 服务器是否已启动
   - 设备 IP 地址是否正确
   - 端口是否正确（默认为 8080）
3. 某些高级脚本可能需要 Android 设备的额外权限
4. 为了安全起见，仅在开发环境或受信任的网络中使用此功能 
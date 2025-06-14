# 🔧 RPA应用调试指南

本指南帮助您排查和解决RPA应用中常见的问题，特别是JSON解析错误。

## 📊 JSON解析错误排查

### 问题症状
```
处理脚本执行请求失败：SyntaxError：JSON Parse error：Unexpected character：
```

### 🔍 排查步骤

#### 1. 检查请求数据格式
使用浏览器开发者工具查看实际发送的请求：

1. 打开浏览器开发者工具 (F12)
2. 切换到 "Network" 标签页
3. 执行脚本并查看请求详情
4. 检查 Request Payload 中的数据格式

**正确的JSON格式应该是：**
```json
{
  "script": "console.log('Hello World');"
}
```

#### 2. 常见的数据格式问题

| 问题类型 | 错误示例 | 正确格式 |
|---------|----------|----------|
| 缺少引号 | `{ script: "test" }` | `{ "script": "test" }` |
| 不完整JSON | `{ "script": "test"` | `{ "script": "test" }` |
| 特殊字符未转义 | `{ "script": "console.log("test")" }` | `{ "script": "console.log(\"test\")" }` |
| 换行符问题 | 包含未转义的换行符 | 使用 `\n` 转义 |

#### 3. 服务器端日志检查

查看Android Logcat输出，寻找以下日志：
```
收到脚本执行请求，原始数据: [数据内容]
JSON解析失败，尝试其他解析方式: [错误信息]
处理后的脚本长度: [长度]
```

使用命令查看日志：
```bash
# 过滤RPA相关日志
adb logcat | grep -i "rpa\|script\|json"

# 或使用React Native命令
npx react-native log-android
```

#### 4. 网络传输问题检查

**检查内容编码：**
- 确保请求头包含 `Content-Type: application/json`
- 检查字符编码是否为UTF-8
- 验证Content-Length是否正确

**代理模式测试：**
如果直连失败，尝试使用代理模式：
1. 在Web界面点击"使用代理连接"
2. 观察是否还有JSON解析错误
3. 对比直连和代理模式的请求差异

### 🛠️ 解决方案

#### 方案1: 检查Web界面发送逻辑
确保JavaScript代码正确序列化数据：
```javascript
// 正确的发送方式
const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ script: scriptContent })
});
```

#### 方案2: 服务器端容错处理
我们已经改进了HttpService.ts中的JSON解析逻辑：
- 支持多种数据格式自动检测
- 自动清理控制字符
- 提供详细的错误信息

#### 方案3: 使用curl测试
直接使用curl命令测试API：
```bash
# 测试状态接口
curl -X GET http://[设备IP]:8080/status

# 测试脚本执行接口
curl -X POST http://[设备IP]:8080/execute-script \
  -H "Content-Type: application/json" \
  -d '{"script":"console.log(\"Hello World\");"}'
```

### 📝 调试日志增强

在出现问题时，可以临时启用详细日志：

**在HttpService.ts中添加调试代码：**
```typescript
console.log('=== 调试信息 ===');
console.log('请求类型:', request.type);
console.log('请求URL:', request.url);
console.log('原始数据类型:', typeof request.postData);
console.log('原始数据长度:', request.postData ? request.postData.length : 0);
console.log('原始数据hex:', request.postData ? Buffer.from(request.postData).toString('hex').substring(0, 100) : 'null');
console.log('===============');
```

## 🌐 网络连接问题

### 常见问题

#### 1. "Failed to fetch" 错误
**可能原因：**
- 防火墙阻止连接
- 设备和电脑不在同一网络
- IP地址或端口错误
- CORS策略限制

**解决方案：**
1. 使用ping命令测试网络连通性
2. 检查防火墙设置
3. 尝试使用代理模式
4. 确认设备IP地址正确

#### 2. 连接超时
**解决方案：**
- 增加超时时间
- 检查网络稳定性
- 尝试重启应用和网络

#### 3. CORS错误
**解决方案：**
- 使用代理模式绕过CORS限制
- 确保服务器正确设置CORS头

## 🚀 性能优化建议

### 1. 减少网络请求
- 批量执行相关脚本
- 使用连接池复用连接

### 2. 脚本优化
- 避免在脚本中使用大量console.log
- 控制脚本执行时间
- 使用异步操作避免阻塞

### 3. 错误处理
- 在脚本中添加try-catch
- 设置合理的超时时间
- 提供用户友好的错误信息

## 📞 获取帮助

### 日志收集
当遇到问题时，请收集以下信息：
1. Android Logcat日志
2. Web浏览器控制台日志
3. Network面板中的请求详情
4. 具体的错误信息和复现步骤

### 常用命令
```bash
# 查看Android日志
adb logcat | grep -E "(RPA|Script|JSON|Error)"

# 重启Metro服务器
npm start --reset-cache

# 清理并重新构建
cd android && ./gradlew clean && cd .. && npm run android

# 检查端口占用
netstat -an | grep 8080
netstat -an | grep 3002
```

记住：大多数JSON解析错误都是由于数据格式不正确或网络传输问题导致的。通过系统性的排查，通常都能找到根本原因并解决问题。 
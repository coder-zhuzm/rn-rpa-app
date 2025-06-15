/* eslint-disable */
const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// 创建一个简单的代理函数
function proxyRequest(targetUrl, method, headers, body, callback) {
  const url = new URL(targetUrl);

  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: method,
    headers: headers || {},
  };

  console.log(`代理请求: ${method} ${targetUrl}`);

  const req = http.request(options, res => {
    let responseData = '';

    res.on('data', chunk => {
      responseData += chunk;
    });

    res.on('end', () => {
      callback({
        statusCode: res.statusCode,
        headers: res.headers,
        data: responseData,
      });
    });
  });

  req.on('error', error => {
    console.error(`代理请求错误: ${error.message}`);
    callback({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ error: error.message }),
    });
  });

  if (body) {
    req.write(body);
  }

  req.end();
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // 处理代理请求
  if (req.url.startsWith('/proxy/')) {
    let targetUrl = req.url.substring(7); // 移除 '/proxy/' 前缀

    // 如果没有指定协议，添加http://
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'http://' + targetUrl;
    }

    // 收集请求体数据
    let requestBody = '';
    let hasError = false;

    req.on('data', chunk => {
      try {
        // 确保使用UTF-8编码读取数据
        const chunkStr = chunk.toString('utf8');
        requestBody += chunkStr;

        // 检查是否包含乱码字符
        if (/\ufffd/.test(chunkStr)) {
          console.warn('⚠️ 代理服务器检测到数据块包含乱码字符');
        }
      } catch (error) {
        console.error('读取请求数据失败:', error);
        hasError = true;
      }
    });

    req.on('error', error => {
      console.error('请求流错误:', error);
      hasError = true;
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(
        JSON.stringify({
          success: false,
          error: '请求处理失败: ' + error.message,
        }),
      );
    });

    req.on('end', () => {
      if (hasError) {
        return;
      }

      console.log('代理请求目标:', targetUrl);
      console.log('请求方法:', req.method);
      console.log('请求体长度:', requestBody.length);
      console.log('请求体包含中文:', /[\u4e00-\u9fff]/.test(requestBody));
      console.log('请求体包含乱码:', /\ufffd/.test(requestBody));
      console.log('请求体前200字符:', requestBody.substring(0, 200));

      // 验证和清理请求体数据
      let cleanedBody = requestBody;
      if (requestBody) {
        try {
          // 如果是JSON数据，验证其有效性
          if (
            req.headers['content-type'] &&
            req.headers['content-type'].includes('application/json')
          ) {
            const parsed = JSON.parse(requestBody);
            cleanedBody = JSON.stringify(parsed); // 重新序列化以确保格式正确
            console.log('JSON数据验证成功');
          }
        } catch (jsonError) {
          console.warn('JSON验证失败，使用原始数据:', jsonError.message);
          // 移除可能的控制字符
          cleanedBody = requestBody.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        }
      }

      // 设置请求头
      const proxyHeaders = {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Content-Length': Buffer.byteLength(cleanedBody, 'utf8'),
      };

      // 转发请求到目标服务器
      proxyRequest(targetUrl, req.method, proxyHeaders, cleanedBody, response => {
        // 设置响应头
        res.writeHead(response.statusCode, {
          'Content-Type': response.headers['content-type'] || 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        });

        // 发送响应数据
        res.end(response.data);
      });
    });

    return;
  }

  // 处理OPTIONS请求（CORS预检请求）
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // 处理静态文件请求
  if (req.url === '/') {
    req.url = '/index.html';
  }

  // 获取文件路径 - 使用新的目录结构
  const filePath = path.join(__dirname, 'public', req.url);
  const extname = path.extname(filePath);

  // 设置内容类型
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // 读取文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // 成功响应
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 导出服务器实例，以便可以从其他文件启动
module.exports = {
  start: () => {
    server.listen(PORT, () => {
      console.log(`Web调试服务器运行在 http://localhost:${PORT}/`);
      console.log(`调试界面可访问: http://localhost:${PORT}/index.html`);
      console.log(`代理服务可用: http://localhost:${PORT}/proxy/`);
    });
    return server;
  },
  stop: () => {
    server.close();
  },
};

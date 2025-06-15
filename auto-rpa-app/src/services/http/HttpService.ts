import { Alert } from 'react-native';
import httpBridge from 'react-native-http-bridge';

import { ScriptManager, ScriptContext } from '../../managers/ScriptManager';

/**
 * HTTP服务类 - 负责管理RPA应用的HTTP服务器
 */
export class HttpService {
  private static instance: HttpService;
  private isRunning: boolean = false;
  private port: number = 8080;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private healthCheckIntervalMs: number = 10000; // 10秒检查一次

  private constructor() {}

  /**
   * 获取HttpService单例
   */
  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }

  /**
   * 启动HTTP服务器
   * @param port 服务器端口
   * @returns 是否成功启动
   */
  public start(port: number = 8080): boolean {
    if (this.isRunning) {
      console.log('HTTP服务器已经在运行中');
      return true;
    }

    this.port = port;

    try {
      // 先停止之前的服务（如果存在）
      this.forceStop();

      // 配置HTTP服务器
      httpBridge.start(this.port, 'http_service', (request: any) => {
        console.log('收到HTTP请求:', request);

        // 添加CORS响应头和UTF-8编码
        const corsHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Encoding': 'utf-8',
        };

        // 处理OPTIONS请求（预检请求）
        if (request.type === 'OPTIONS') {
          httpBridge.respond(
            request.requestId,
            200,
            'application/json; charset=utf-8',
            this.safeJsonStringify({
              message: 'CORS预检请求成功',
            }),
            corsHeaders,
          );
          return;
        }

        if (request.type === 'POST' && request.url === '/execute-script') {
          this.handleScriptExecution(request, corsHeaders);
        } else if (request.type === 'GET' && request.url === '/status') {
          // 返回服务状态 - 确保message字段不为undefined
          const statusResponse = {
            status: 'running',
            message: 'RPA服务运行中',
            timestamp: new Date().toISOString(),
            serverPort: this.port,
            uptime: Date.now(),
            reconnectAttempts: this.reconnectAttempts,
          };
          console.log('Status响应对象:', statusResponse);
          const statusJson = this.safeJsonStringify(statusResponse);
          console.log('Status JSON字符串:', statusJson);
          httpBridge.respond(
            request.requestId,
            200,
            'application/json; charset=utf-8',
            statusJson,
            corsHeaders,
          );
        } else if (request.type === 'GET' && request.url === '/health') {
          // 健康检查端点
          const healthResponse = {
            status: 'healthy',
            message: '服务器健康状态良好',
            timestamp: new Date().toISOString(),
            serverPort: this.port,
          };
          httpBridge.respond(
            request.requestId,
            200,
            'application/json; charset=utf-8',
            this.safeJsonStringify(healthResponse),
            corsHeaders,
          );
        } else {
          // 404 响应
          httpBridge.respond(
            request.requestId,
            404,
            'application/json; charset=utf-8',
            this.safeJsonStringify({
              error: 'Not Found',
              message: '请求的路径不存在',
              url: request.url,
              method: request.type,
            }),
            corsHeaders,
          );
        }
      });

      this.isRunning = true;
      this.reconnectAttempts = 0;
      console.log(`HTTP服务器已启动，端口: ${this.port}`);

      // 启动健康检查
      this.startHealthCheck();

      return true;
    } catch (error) {
      console.error('启动HTTP服务器失败:', error);
      Alert.alert(
        '错误',
        `启动HTTP服务器失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  /**
   * 停止HTTP服务器
   */
  public stop(): void {
    try {
      this.forceStop();
      console.log('HTTP服务器已停止');
    } catch (error) {
      console.error('停止HTTP服务器失败:', error);
    }
  }

  /**
   * 强制停止HTTP服务器（内部方法）
   */
  private forceStop(): void {
    try {
      // 停止健康检查
      this.stopHealthCheck();

      // 停止HTTP服务器
      httpBridge.stop();
      this.isRunning = false;
    } catch (error) {
      console.error('强制停止HTTP服务器时出错:', error);
      // 即使出错也要重置状态
      this.isRunning = false;
    }
  }

  /**
   * 启动健康检查
   */
  private startHealthCheck(): void {
    this.stopHealthCheck(); // 先停止之前的检查

    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckIntervalMs);

    console.log('HTTP服务器健康检查已启动');
  }

  /**
   * 停止健康检查
   */
  private stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('HTTP服务器健康检查已停止');
    }
  }

  /**
   * 执行健康检查
   */
  private performHealthCheck(): void {
    if (!this.isRunning) {
      return;
    }

    // 这里可以添加更复杂的健康检查逻辑
    // 比如检查端口是否还在监听等
    console.log('执行HTTP服务器健康检查...');

    // 如果发现服务器异常，尝试重启
    // 注意：这里简化处理，实际项目中可能需要更复杂的检测逻辑
  }

  /**
   * 重启HTTP服务器
   */
  public restart(): boolean {
    console.log('重启HTTP服务器...');

    this.stop();

    // 等待一小段时间确保端口释放
    setTimeout(() => {
      const success = this.start(this.port);
      if (success) {
        console.log('HTTP服务器重启成功');
        Alert.alert('成功', 'HTTP服务器已重启');
      } else {
        console.error('HTTP服务器重启失败');
        Alert.alert('错误', 'HTTP服务器重启失败');
      }
    }, 1000);

    return true;
  }

  /**
   * 尝试自动重连
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('已达到最大重连次数，停止重连');
      Alert.alert('警告', 'HTTP服务器连接失败，已停止自动重连。请手动重启服务器。');
      return;
    }

    this.reconnectAttempts++;
    console.log(`尝试重连HTTP服务器 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      const success = this.start(this.port);
      if (!success) {
        this.attemptReconnect();
      }
    }, 2000 * this.reconnectAttempts); // 递增延迟
  }

  /**
   * 处理脚本执行请求
   */
  private async handleScriptExecution(request: any, corsHeaders: any = {}): Promise<void> {
    try {
      console.log('收到脚本执行请求');
      console.log('原始postData类型:', typeof request.postData);
      console.log('原始postData长度:', request.postData ? request.postData.length : 0);
      console.log(
        '原始postData前200字符:',
        request.postData ? request.postData.substring(0, 200) : 'null',
      );

      // 安全地解析JSON数据
      let body: any = {};
      let script: string = '';

      if (request.postData) {
        // 首先检查原始数据是否包含乱码
        const hasGarbledChars = /\ufffd/.test(request.postData);
        if (hasGarbledChars) {
          console.error('⚠️ 检测到postData中包含乱码字符，这表明数据在接收时已损坏');
        }

        try {
          // 首先尝试直接解析JSON
          body = JSON.parse(request.postData);
          script = body.script || '';
          console.log('成功解析JSON，script长度:', script.length);
        } catch (jsonError) {
          console.warn('JSON解析失败，尝试其他解析方式:', jsonError);

          // 如果JSON解析失败，尝试作为普通文本处理
          const postData = request.postData.toString();

          // 检查是否是URL编码的数据
          if (postData.includes('script=')) {
            try {
              const urlParams = new URLSearchParams(postData);
              script = urlParams.get('script') || '';
              console.log('从URL编码数据中提取脚本长度:', script.length);
            } catch (urlError) {
              console.error('URL解析也失败:', urlError);
              script = postData; // 最后尝试直接使用原始数据
            }
          } else {
            // 尝试直接使用原始数据作为脚本
            script = postData;
            console.log('直接使用原始数据作为脚本');
          }
        }
      }

      // 验证脚本内容
      if (!script || script.trim() === '') {
        console.error('脚本内容为空');
        httpBridge.respond(
          request.requestId,
          400,
          'application/json; charset=utf-8',
          this.safeJsonStringify({
            success: false,
            error: '缺少script参数或脚本内容为空',
          }),
          corsHeaders,
        );
        return;
      }

      // 清理脚本内容（移除可能的控制字符）
      script = script.replace(/[\x00-\x1F\x7F]/g, '').trim();

      console.log('处理后的脚本长度:', script.length);
      console.log('脚本前100字符:', script.substring(0, 100));

      // 创建脚本执行上下文
      const context: ScriptContext = {
        RPAServiceModule: require('../../modules/RPAServiceModule').default,
        console,
        Alert,
      };

      // 执行脚本
      const scriptManager = ScriptManager.getInstance();
      const result = await scriptManager.executeScript(script, context);

      // 返回执行结果 - 使用自定义JSON序列化确保Unicode正确处理
      const responseData = {
        success: result.success,
        result: result.result,
        error: result.error,
        errorType: result.errorType,
        suggestion: result.suggestion,
        stack: result.stack,
        timestamp: new Date().toISOString(),
      };

      // 使用自定义方法确保中文字符正确编码
      const jsonString = this.safeJsonStringify(responseData);
      console.log('响应数据JSON长度:', jsonString.length);
      console.log('响应数据包含中文字符:', /[\u4e00-\u9fff]/.test(jsonString));

      // 直接使用处理后的JSON字符串，移除TextDecoder处理
      console.log('发送响应，JSON字符串长度:', jsonString.length);

      httpBridge.respond(
        request.requestId,
        200,
        'application/json; charset=utf-8',
        jsonString,
        corsHeaders,
      );
    } catch (error) {
      console.error('处理脚本执行请求失败:', error);

      // 提供更详细的错误信息
      let errorMessage = '服务器内部错误';
      if (error instanceof SyntaxError) {
        errorMessage = `JSON解析错误: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      httpBridge.respond(
        request.requestId,
        500,
        'application/json; charset=utf-8',
        this.safeJsonStringify({
          success: false,
          error: errorMessage,
          details: error instanceof Error ? error.stack : String(error),
        }),
        corsHeaders,
      );
    }
  }

  /**
   * 获取服务器状态
   */
  public isServerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * 获取服务器端口
   */
  public getPort(): number {
    return this.port;
  }

  /**
   * 转义Unicode字符为转义序列
   */
  private escapeUnicodeChars(str: string): string {
    // 检查是否包含需要转义的字符
    const hasChinese = /[\u4e00-\u9fff]/.test(str);
    const hasEmoji =
      /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/u.test(
        str,
      );

    if (hasChinese || hasEmoji) {
      console.log('转义Unicode字符');
      return str.replace(/[\u0080-\uFFFF]/g, function (match) {
        return '\\u' + ('0000' + match.charCodeAt(0).toString(16)).substr(-4);
      });
    }

    return str;
  }

  /**
   * 安全的JSON序列化，确保Unicode字符正确处理
   */
  private safeJsonStringify(obj: any): string {
    try {
      console.log('开始JSON序列化，对象类型:', typeof obj);
      console.log('对象keys:', obj && typeof obj === 'object' ? Object.keys(obj) : 'N/A');

      // 先清理对象，移除可能导致序列化失败的属性
      const cleanedObj = this.cleanObjectForSerialization(obj);

      // 使用安全的JSON.stringify，包含replacer函数处理特殊值
      const jsonString = JSON.stringify(cleanedObj, (key, value) => {
        // 处理函数类型
        if (typeof value === 'function') {
          return '[Function]';
        }

        // 处理undefined
        if (value === undefined) {
          return null;
        }

        // 处理循环引用和复杂对象
        if (value && typeof value === 'object') {
          // 检查是否是原生对象类型
          if (
            value.constructor &&
            value.constructor.name !== 'Object' &&
            value.constructor.name !== 'Array'
          ) {
            return `[${value.constructor.name}]`;
          }
        }

        // 处理Error对象
        if (value instanceof Error) {
          return {
            name: value.name,
            message: value.message,
            stack: value.stack,
          };
        }

        return value;
      });

      console.log('JSON序列化成功，长度:', jsonString.length);
      console.log('JSON前200字符:', jsonString.substring(0, 200));

      // 使用Unicode转义处理中文字符
      const finalJsonString = this.escapeUnicodeChars(jsonString);
      console.log('最终JSON字符串长度:', finalJsonString.length);

      return finalJsonString;
    } catch (error) {
      console.error('JSON序列化失败详细信息:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        objectType: typeof obj,
        objectKeys: obj && typeof obj === 'object' ? Object.keys(obj) : [],
      });

      // 返回一个简化的错误响应
      try {
        return JSON.stringify({
          success: false,
          error: 'JSON序列化失败',
          details: error instanceof Error ? error.message : String(error),
        });
      } catch (fallbackError) {
        // 如果连错误信息都不能序列化，返回最基本的响应
        return '{"success":false,"error":"JSON序列化彻底失败"}';
      }
    }
  }

  /**
   * 清理对象，移除可能导致序列化失败的属性
   */
  private cleanObjectForSerialization(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // 处理基本类型
    if (typeof obj !== 'object') {
      return obj;
    }

    // 处理Date对象
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    // 处理Error对象
    if (obj instanceof Error) {
      return {
        name: obj.name,
        message: obj.message,
        stack: obj.stack,
      };
    }

    // 处理数组
    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanObjectForSerialization(item));
    }

    // 处理普通对象
    const cleaned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        // 跳过函数
        if (typeof value === 'function') {
          continue;
        }

        // 跳过symbol
        if (typeof value === 'symbol') {
          continue;
        }

        // 递归处理嵌套对象
        try {
          cleaned[key] = this.cleanObjectForSerialization(value);
        } catch (error) {
          // 如果某个属性处理失败，标记为错误
          cleaned[key] = '[处理失败]';
        }
      }
    }

    return cleaned;
  }

  /**
   * 递归处理对象中的Unicode字符串（保留用于向后兼容）
   */
  private processUnicodeStrings(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      // 直接返回字符串，不做额外处理
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.processUnicodeStrings(item));
    }

    if (typeof obj === 'object') {
      const processed: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          processed[key] = this.processUnicodeStrings(obj[key]);
        }
      }
      return processed;
    }

    return obj;
  }
}

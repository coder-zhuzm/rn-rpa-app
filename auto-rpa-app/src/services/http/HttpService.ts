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
      // 配置HTTP服务器
      httpBridge.start(this.port, 'http_service', (request: any) => {
        console.log('收到HTTP请求:', request);
        
        // 添加CORS响应头和UTF-8编码
        const corsHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Encoding': 'utf-8'
        };
        
        // 处理OPTIONS请求（预检请求）
        if (request.type === 'OPTIONS') {
          httpBridge.respond(request.requestId, 200, 'application/json; charset=utf-8', this.safeJsonStringify({
            message: 'CORS预检请求成功'
          }), corsHeaders);
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
            serverPort: this.port
          };
          console.log('Status响应对象:', statusResponse);
          const statusJson = this.safeJsonStringify(statusResponse);
          console.log('Status JSON字符串:', statusJson);
          httpBridge.respond(request.requestId, 200, 'application/json; charset=utf-8', statusJson, corsHeaders);
        } else {
          // 404 响应
          httpBridge.respond(request.requestId, 404, 'application/json; charset=utf-8', this.safeJsonStringify({
            error: 'Not Found',
            message: '请求的路径不存在',
            url: request.url,
            method: request.type
          }), corsHeaders);
        }
      });

      this.isRunning = true;
      console.log(`HTTP服务器已启动，端口: ${this.port}`);
      return true;
    } catch (error) {
      console.error('启动HTTP服务器失败:', error);
      Alert.alert('错误', `启动HTTP服务器失败: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * 停止HTTP服务器
   */
  public stop(): void {
    try {
      httpBridge.stop();
      this.isRunning = false;
      console.log('HTTP服务器已停止');
    } catch (error) {
      console.error('停止HTTP服务器失败:', error);
    }
  }

  /**
   * 处理脚本执行请求
   */
  private async handleScriptExecution(request: any, corsHeaders: any = {}): Promise<void> {
    try {
      console.log('收到脚本执行请求');
      console.log('原始postData类型:', typeof request.postData);
      console.log('原始postData长度:', request.postData ? request.postData.length : 0);
      console.log('原始postData前200字符:', request.postData ? request.postData.substring(0, 200) : 'null');
      
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
        httpBridge.respond(request.requestId, 400, 'application/json; charset=utf-8', this.safeJsonStringify({
          success: false,
          error: '缺少script参数或脚本内容为空'
        }), corsHeaders);
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
        timestamp: new Date().toISOString()
      };
      
      // 使用自定义方法确保中文字符正确编码
      const jsonString = this.safeJsonStringify(responseData);
      console.log('响应数据JSON长度:', jsonString.length);
      console.log('响应数据包含中文字符:', /[\u4e00-\u9fff]/.test(jsonString));
      
      // 直接使用处理后的JSON字符串，移除TextDecoder处理
      console.log('发送响应，JSON字符串长度:', jsonString.length);
      
      httpBridge.respond(request.requestId, 200, 'application/json; charset=utf-8', jsonString, corsHeaders);

    } catch (error) {
      console.error('处理脚本执行请求失败:', error);
      
      // 提供更详细的错误信息
      let errorMessage = '服务器内部错误';
      if (error instanceof SyntaxError) {
        errorMessage = `JSON解析错误: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      httpBridge.respond(request.requestId, 500, 'application/json; charset=utf-8', this.safeJsonStringify({
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      }), corsHeaders);
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
    const hasEmoji = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/u.test(str);
    
    if (hasChinese || hasEmoji) {
      console.log('转义Unicode字符');
      return str.replace(/[\u0080-\uFFFF]/g, function(match) {
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
          if (value.constructor && value.constructor.name !== 'Object' && value.constructor.name !== 'Array') {
            return `[${value.constructor.name}]`;
          }
        }
        
        // 处理Error对象
        if (value instanceof Error) {
          return {
            name: value.name,
            message: value.message,
            stack: value.stack
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
        objectKeys: obj && typeof obj === 'object' ? Object.keys(obj) : []
      });
      
      // 返回一个简化的错误响应
      try {
        return JSON.stringify({
          success: false,
          error: 'JSON序列化失败',
          details: error instanceof Error ? error.message : String(error)
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
        stack: obj.stack
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
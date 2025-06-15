import { ScriptErrorAnalyzer } from '../utils/ScriptErrorAnalyzer';

/**
 * 脚本执行上下文接口
 */
export interface ScriptContext {
  [key: string]: any;
}

/**
 * 脚本执行结果接口
 */
export interface ScriptResult {
  success: boolean;
  result?: any;
  error?: string;
  errorType?: string;
  suggestion?: string;
  stack?: string;
}

/**
 * 脚本管理器类 - 负责管理和执行JavaScript脚本
 */
export class ScriptManager {
  private static instance: ScriptManager;

  private constructor() {}

  /**
   * 获取ScriptManager单例
   */
  public static getInstance(): ScriptManager {
    if (!ScriptManager.instance) {
      ScriptManager.instance = new ScriptManager();
    }
    return ScriptManager.instance;
  }

  /**
   * 执行JavaScript脚本
   * @param script 要执行的脚本代码
   * @param context 脚本执行上下文
   * @returns 脚本执行结果
   */
  public async executeScript(script: string, context: ScriptContext = {}): Promise<ScriptResult> {
    console.log('🚀 开始执行脚本...');
    console.log('📜 脚本长度:', script.length);
    console.log('🔧 上下文键:', Object.keys(context));

    try {
      // 验证脚本语法
      const validation = this.validateScript(script);
      if (!validation.valid) {
        console.error('❌ 脚本语法验证失败:', validation.error);
        return {
          success: false,
          error: `语法错误: ${validation.error}`,
        };
      }

      // 准备执行环境
      const contextKeys = Object.keys(context);
      const contextValues = Object.values(context);

      console.log('✅ 语法验证通过，准备执行...');

      // 构建函数体，将脚本包装在异步函数中
      const functionBody = `
        let scriptResult;
        try {
          // 用户脚本开始
          scriptResult = (function() {
            ${script}
          })();
          // 用户脚本结束
          
          // 如果脚本有返回值，使用它；否则使用默认成功消息
          const result = scriptResult !== undefined ? scriptResult : "脚本执行成功";
          return { success: true, result: result };
        } catch (scriptError) {
          console.error('用户脚本内部错误:', scriptError);
          return { 
            success: false, 
            error: scriptError.message || "脚本内部执行错误",
            errorType: 'ScriptRuntimeError',
            stack: scriptError.stack
          };
        }
      `;

      // 创建动态函数

      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

      const scriptFunction = new AsyncFunction(...contextKeys, functionBody);

      console.log('⚡ 执行脚本函数...');
      const result = await scriptFunction(...contextValues);

      if (result.success) {
        console.log('✅ 脚本执行成功:', result);
      } else {
        console.error('❌ 脚本执行返回失败:', result);
      }

      return result;
    } catch (error: unknown) {
      // 这里是ScriptManager层面的错误，不是用户脚本的错误
      console.error('💥 ScriptManager执行失败 - 这是系统级错误:');

      const err = error as Error;
      console.error('错误类型:', err.constructor.name);
      console.error('错误消息:', err.message);
      console.error('错误堆栈:', err.stack);

      // 使用错误分析器进行详细分析
      const analysis = ScriptErrorAnalyzer.analyzeError(err, script);

      // 生成并打印详细的错误报告
      const errorReport = ScriptErrorAnalyzer.generateErrorReport(err, script);
      console.error('📊 详细错误分析:\n', errorReport);

      return {
        success: false,
        error: `${analysis.category}: ${err.message || '未知错误'}`,
        errorType: err.constructor.name,
        suggestion: analysis.suggestion,
        stack: err.stack,
      };
    }
  }

  /**
   * 验证脚本语法
   * @param script 要验证的脚本代码
   * @returns 验证结果
   */
  public validateScript(script: string): { valid: boolean; error?: string } {
    try {
      // 使用Function构造函数尝试解析脚本，检查语法错误
      // eslint-disable-next-line no-new-func
      new Function(script);
      return { valid: true };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        valid: false,
        error: err.message || '语法错误',
      };
    }
  }
}

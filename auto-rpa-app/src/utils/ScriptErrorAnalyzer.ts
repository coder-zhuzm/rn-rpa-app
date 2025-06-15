/**
 * 脚本错误分析器
 * 提供详细的错误分析和解决建议
 */

export interface ErrorAnalysis {
  category: string;
  description: string;
  suggestion: string;
  examples: string[];
  relatedDocs?: string[];
}

export class ScriptErrorAnalyzer {
  /**
   * 分析脚本错误并提供建议
   */
  public static analyzeError(error: Error | string, script?: string): ErrorAnalysis {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? '' : error.stack || '';

    // 语法错误分析
    if (this.isSyntaxError(errorMessage)) {
      return this.analyzeSyntaxError(errorMessage, script);
    }

    // 运行时错误分析
    if (this.isRuntimeError(errorMessage)) {
      return this.analyzeRuntimeError(errorMessage, errorStack);
    }

    // RPA相关错误分析
    if (this.isRPAError(errorMessage)) {
      return this.analyzeRPAError(errorMessage);
    }

    // 默认分析
    return this.getDefaultAnalysis(errorMessage);
  }

  /**
   * 检查是否为语法错误
   */
  private static isSyntaxError(message: string): boolean {
    const syntaxKeywords = [
      'Unexpected token',
      'Unexpected end of input',
      'Invalid or unexpected token',
      'Unexpected identifier',
      'Missing',
      'Expected',
    ];
    return syntaxKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * 检查是否为运行时错误
   */
  private static isRuntimeError(message: string): boolean {
    const runtimeKeywords = [
      'is not defined',
      'Cannot read property',
      'Cannot read properties',
      'is not a function',
      'Cannot access before initialization',
      'Assignment to constant variable',
    ];
    return runtimeKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * 检查是否为RPA相关错误
   */
  private static isRPAError(message: string): boolean {
    const rpaKeywords = [
      'RPAServiceModule',
      'Permission denied',
      'UI Automator',
      'launchSettings',
      'clickByText',
      'Native module',
    ];
    return rpaKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * 分析语法错误
   */
  private static analyzeSyntaxError(message: string, script?: string): ErrorAnalysis {
    if (message.includes('Unexpected token')) {
      return {
        category: '语法错误 - 意外的符号',
        description: '脚本中包含了JavaScript解析器无法识别的符号或字符',
        suggestion: '检查括号、引号、分号是否正确匹配，确保没有多余的字符',
        examples: [
          '正确: console.log("Hello");',
          '错误: console.log("Hello";',
          '正确: { "key": "value" }',
          '错误: { key: "value" }',
        ],
      };
    }

    if (message.includes('Unexpected end of input')) {
      return {
        category: '语法错误 - 代码不完整',
        description: '脚本意外结束，可能缺少闭合的括号或引号',
        suggestion: '检查所有的括号 () {} [] 和引号 "" \'\' 是否正确闭合',
        examples: [
          '正确: if (condition) { console.log("test"); }',
          '错误: if (condition) { console.log("test");',
          '正确: console.log("Hello World");',
          '错误: console.log("Hello World"',
        ],
      };
    }

    return {
      category: '语法错误',
      description: '脚本语法不符合JavaScript规范',
      suggestion: '使用在线JavaScript语法检查器验证代码，或在浏览器控制台中测试脚本片段',
      examples: ['使用有效的JavaScript语法', '确保所有语句以分号结尾', '检查变量和函数名的拼写'],
    };
  }

  /**
   * 分析运行时错误
   */
  private static analyzeRuntimeError(message: string, stack: string): ErrorAnalysis {
    if (message.includes('is not defined')) {
      const varName = this.extractVariableName(message, 'is not defined');
      return {
        category: '运行时错误 - 变量未定义',
        description: `变量或函数 "${varName}" 未定义`,
        suggestion: '检查变量名拼写，确保变量已声明，或检查是否需要在执行上下文中提供',
        examples: [
          '正确: const message = "Hello"; console.log(message);',
          '错误: console.log(mesage); // 拼写错误',
          '正确: RPAServiceModule.launchSettings();',
          '错误: RPAModule.launchSettings(); // 模块名错误',
        ],
      };
    }

    if (message.includes('Cannot read property') || message.includes('Cannot read properties')) {
      return {
        category: '运行时错误 - 属性访问错误',
        description: '尝试访问null或undefined对象的属性',
        suggestion: '在访问属性前检查对象是否存在，使用可选链操作符(?.)或条件判断',
        examples: [
          '安全访问: obj?.property',
          '条件检查: if (obj && obj.property) { ... }',
          '默认值: const value = obj?.property || "default";',
        ],
      };
    }

    if (message.includes('is not a function')) {
      return {
        category: '运行时错误 - 函数调用错误',
        description: '尝试调用一个不是函数的值',
        suggestion: '检查函数名拼写，确保调用的是正确的函数',
        examples: [
          '正确: RPAServiceModule.launchSettings()',
          '错误: RPAServiceModule.launchSettings // 缺少括号',
          '检查: typeof functionName === "function"',
        ],
      };
    }

    return {
      category: '运行时错误',
      description: '脚本执行过程中发生错误',
      suggestion: '检查错误堆栈信息，定位具体的错误行，并验证相关变量和函数调用',
      examples: [
        '使用try-catch包装可能出错的代码',
        '添加console.log输出调试信息',
        '分步执行脚本定位问题',
      ],
    };
  }

  /**
   * 分析RPA相关错误
   */
  private static analyzeRPAError(message: string): ErrorAnalysis {
    if (message.includes('RPAServiceModule')) {
      return {
        category: 'RPA模块错误',
        description: 'RPA原生模块调用失败',
        suggestion: '确保RPA应用已启动，原生模块已正确注册，并检查方法名和参数',
        examples: [
          '启动RPA服务: RPAServiceModule.start()',
          '检查模块可用性: typeof RPAServiceModule !== "undefined"',
          '正确调用: await RPAServiceModule.launchSettings()',
        ],
        relatedDocs: ['RPA模块API文档', '原生模块调试指南'],
      };
    }

    if (message.includes('Permission denied')) {
      return {
        category: 'RPA权限错误',
        description: 'RPA操作需要更高权限或无障碍服务未启用',
        suggestion: '检查应用权限设置，确保无障碍服务已启用',
        examples: ['启用无障碍服务', '授予必要的系统权限', '检查设备管理员权限'],
        relatedDocs: ['权限配置指南', '无障碍服务设置'],
      };
    }

    return {
      category: 'RPA系统错误',
      description: 'RPA系统功能调用异常',
      suggestion: '检查设备状态，重启应用，或查看系统日志获取更多信息',
      examples: ['重启RPA应用', '检查设备状态', '查看Android系统日志'],
    };
  }

  /**
   * 默认错误分析
   */
  private static getDefaultAnalysis(message: string): ErrorAnalysis {
    return {
      category: '未知错误',
      description: message || '发生了未知错误',
      suggestion: '检查脚本语法和逻辑，查看完整的错误堆栈信息',
      examples: ['添加try-catch错误处理', '使用console.log添加调试信息', '分步测试脚本功能'],
    };
  }

  /**
   * 从错误信息中提取变量名
   */
  private static extractVariableName(message: string, pattern: string): string {
    const parts = message.split(pattern);
    if (parts.length > 0) {
      return parts[0].trim().replace(/^'|'$/g, '').replace(/^"|"$/g, '');
    }
    return 'unknown';
  }

  /**
   * 生成错误报告
   */
  public static generateErrorReport(error: Error | string, script?: string): string {
    const analysis = this.analyzeError(error, script);

    return `
🚨 脚本执行错误报告
==================

📋 错误类别: ${analysis.category}
📝 错误描述: ${analysis.description}
💡 解决建议: ${analysis.suggestion}

📚 示例代码:
${analysis.examples.map(example => `  • ${example}`).join('\n')}

${
  analysis.relatedDocs
    ? `📖 相关文档:\n${analysis.relatedDocs.map(doc => `  • ${doc}`).join('\n')}`
    : ''
}

🔍 调试提示:
  • 在浏览器开发者工具中测试脚本片段
  • 使用console.log添加调试输出
  • 检查错误发生的具体行号
  • 验证所有变量和函数是否可用

📞 如需更多帮助，请查看调试指南: DEBUGGING_GUIDE.md
`.trim();
  }
}

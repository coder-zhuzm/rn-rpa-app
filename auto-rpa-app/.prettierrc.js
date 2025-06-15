module.exports = {
  // 基础格式化选项
  printWidth: 100, // 行宽限制
  tabWidth: 2, // 缩进宽度
  useTabs: false, // 使用空格而不是制表符
  semi: true, // 语句末尾添加分号
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', // 对象属性引号按需添加

  // JSX 相关
  jsxSingleQuote: false, // JSX中使用双引号
  jsxBracketSameLine: false, // JSX标签的>换行

  // 尾随逗号
  trailingComma: 'all', // 多行时尾随逗号

  // 括号和空格
  bracketSpacing: true, // 对象字面量的括号间添加空格
  bracketSameLine: false, // 多行HTML元素>是否换行
  arrowParens: 'avoid', // 箭头函数参数括号

  // 换行符
  endOfLine: 'lf', // 使用LF换行符

  // 嵌入语言格式化
  embeddedLanguageFormatting: 'auto',

  // HTML相关
  htmlWhitespaceSensitivity: 'css',

  // Vue相关（虽然不用，但保持配置完整性）
  vueIndentScriptAndStyle: false,

  // 文件覆盖配置
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'all',
      },
    },
  ],
};

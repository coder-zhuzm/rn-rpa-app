module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式化，不影响代码逻辑
        'refactor', // 重构代码
        'perf', // 性能优化
        'test', // 测试相关
        'build', // 构建相关
        'ci', // CI/CD相关
        'chore', // 其他杂项
        'revert', // 回滚
        'wip', // 开发中
        'rpa', // RPA功能相关（项目特定）
        'android', // Android平台相关
        'web', // Web调试相关
      ],
    ],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // 主题长度限制
    'subject-max-length': [2, 'always', 100],
    // 主题格式（不以大写字母开头，不以句号结尾）
    'subject-case': [2, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
    // 类型不能为空
    'type-empty': [2, 'never'],
    // 类型格式
    'type-case': [2, 'always', 'lower-case'],
    // 头部最大长度
    'header-max-length': [2, 'always', 120],
    // 正文前需要空行
    'body-leading-blank': [2, 'always'],
    // 脚注前需要空行
    'footer-leading-blank': [2, 'always'],
  },
  // 自定义解析器选项
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([^)]*)\))?: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  // 忽略规则（用于特殊情况）
  ignores: [commit => commit.includes('WIP'), commit => commit.includes('Merge')],
  // 默认忽略
  defaultIgnores: true,
  // 帮助URL
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
};

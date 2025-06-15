module.exports = {
  preset: 'react-native',

  // Mock文件映射
  moduleNameMapper: {
    '^@react-native-community/netinfo$': '<rootDir>/__mocks__/@react-native-community/netinfo.js',
    '^react-native-fs$': '<rootDir>/__mocks__/react-native-fs.js',
    '^react-native-http-bridge$': '<rootDir>/__mocks__/react-native-http-bridge.js',
  },

  // 设置文件
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 转换忽略模式
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|react-native-fs|react-native-http-bridge)/)',
  ],

  // 覆盖率配置
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'App.tsx',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],

  // 清除Mock
  clearMocks: true,

  // 测试超时
  testTimeout: 10000,
};

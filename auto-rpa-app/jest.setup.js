// Jest设置文件

// 全局Mock设置
global.__DEV__ = true;

// Mock NativeModules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  RN.NativeModules.RPAServiceModule = {
    executeScript: jest.fn(() => Promise.resolve('Script executed successfully')),
    getDeviceInfo: jest.fn(() => Promise.resolve({
      model: 'Mock Device',
      version: '1.0.0',
      sdk: 28,
    })),
    checkPermissions: jest.fn(() => Promise.resolve(true)),
  };
  
  return RN;
});

// 全局测试超时
jest.setTimeout(10000);

// 抑制console.warn在测试中的输出
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps') ||
      args[0].includes('componentWillMount')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
}); 
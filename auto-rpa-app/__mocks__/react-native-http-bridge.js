// Mock for react-native-http-bridge
export default {
  start: jest.fn((_port, _serviceName, _callback) => {
    // 模拟HTTP服务器启动成功，但不触发回调避免异步问题
    return Promise.resolve();
  }),

  stop: jest.fn(() => {
    return Promise.resolve();
  }),

  respond: jest.fn((_requestId, _code, _type, _body) => {
    return Promise.resolve();
  }),
};

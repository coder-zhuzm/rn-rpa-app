/**
 * @format
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import App from '../App';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Warning: componentWillMount has been renamed'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('App Component', () => {
  test('renders correctly', () => {
    const { getByText } = render(<App />);

    // 检查应用标题是否存在
    expect(getByText('RPA App')).toBeTruthy();
    expect(getByText('React Native + Android 原生模块')).toBeTruthy();
  });

  test('renders HTTP server status', () => {
    const { getByText } = render(<App />);

    // 检查HTTP服务器状态 (文本可能被分割渲染)
    expect(getByText(/HTTP服务器:/)).toBeTruthy();
    expect(getByText(/运行中/)).toBeTruthy();
    expect(getByText(/端口:/)).toBeTruthy();
    expect(getByText(/8080/)).toBeTruthy();
  });

  test('renders action buttons', () => {
    const { getByText } = render(<App />);

    // 检查主要按钮
    expect(getByText('启动 RPA 服务')).toBeTruthy();
    expect(getByText('停止 HTTP 服务器')).toBeTruthy();
    expect(getByText('🔄 重启 HTTP 服务器')).toBeTruthy();
  });

  test('renders system action buttons', () => {
    const { getByText } = render(<App />);

    // 检查系统操作按钮
    expect(getByText('启动系统设置')).toBeTruthy();
    expect(getByText('启动 WiFi 设置')).toBeTruthy();
    expect(getByText('启动蓝牙设置')).toBeTruthy();
    expect(getByText('启动计算器')).toBeTruthy();
  });

  test('renders script executor button', () => {
    const { getByText } = render(<App />);

    // 检查脚本执行器按钮
    expect(getByText('📜 脚本执行器')).toBeTruthy();
  });

  test('renders help text', () => {
    const { getByText } = render(<App />);

    // 检查帮助文本
    expect(getByText(/启动 RPA 服务：初始化 UI Automator 功能/)).toBeTruthy();
    expect(getByText(/HTTP 服务器：接收来自Web页面的远程脚本执行请求/)).toBeTruthy();
  });
});

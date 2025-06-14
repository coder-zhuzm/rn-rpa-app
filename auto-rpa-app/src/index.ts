/**
 * RPA应用入口文件
 * 用于初始化和启动所有服务
 */

import { ServiceManager } from './services/ServiceManager';

/**
 * 初始化RPA应用
 */
export function initializeRPAApp() {
  console.log('初始化RPA应用...');
  
  // 获取服务管理器实例
  const serviceManager = ServiceManager.getInstance();
  
  // 启动所有服务
  serviceManager.startAllServices();
  
  console.log('RPA应用初始化完成');
  
  return {
    serviceManager
  };
}

/**
 * 关闭RPA应用
 */
export function shutdownRPAApp() {
  console.log('关闭RPA应用...');
  
  // 获取服务管理器实例
  const serviceManager = ServiceManager.getInstance();
  
  // 停止所有服务
  serviceManager.stopAllServices();
  
  console.log('RPA应用已关闭');
} 
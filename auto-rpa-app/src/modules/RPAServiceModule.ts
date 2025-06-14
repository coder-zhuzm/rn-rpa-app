import { NativeModules } from 'react-native';

/**
 * RPA服务模块接口
 */
interface RPAServiceModuleInterface {
  /**
   * 启动RPA服务
   */
  start(): void;

  /**
   * 停止RPA服务
   */
  stop(): void;

  /**
   * 通过文本内容点击元素
   * @param text 要点击的文本内容
   * @returns 点击结果
   */
  clickByText(text: string): Promise<string>;

  /**
   * 通过ID点击元素
   * @param id 要点击的元素ID
   * @returns 点击结果
   */
  clickById(id: string): Promise<string>;

  /**
   * 通过包名启动应用
   * @param packageName 应用包名
   * @returns 启动结果
   */
  launchAppByPackage(packageName: string): Promise<string>;

  /**
   * 启动系统设置
   * @returns 启动结果
   */
  launchSettings(): Promise<string>;

  /**
   * 启动WiFi设置
   * @returns 启动结果
   */
  launchWifiSettings(): Promise<string>;

  /**
   * 启动蓝牙设置
   * @returns 启动结果
   */
  launchBluetoothSettings(): Promise<string>;

  /**
   * 获取设备信息
   * @returns 设备信息
   */
  getDeviceInfo(): Promise<{
    model: string;
    brand: string;
    androidVersion: string;
    sdkVersion: number;
  }>;

  /**
   * 在指定位置输入文本
   * @param text 要输入的文本
   * @returns 输入结果
   */
  inputText(text: string): Promise<string>;

  /**
   * 滚动屏幕
   * @param direction 滚动方向 ('up' | 'down' | 'left' | 'right')
   * @returns 滚动结果
   */
  scroll(direction: 'up' | 'down' | 'left' | 'right'): Promise<string>;

  /**
   * 截取屏幕
   * @param path 保存路径
   * @returns 截图路径
   */
  takeScreenshot(path: string): Promise<string>;

  /**
   * 返回上一级
   * @returns 操作结果
   */
  pressBack(): Promise<string>;

  /**
   * 按下Home键
   * @returns 操作结果
   */
  pressHome(): Promise<string>;
}

/**
 * RPA服务模块
 * 提供与Android原生RPA服务交互的接口
 */
const RPAServiceModule = NativeModules.RPAServiceModule as RPAServiceModuleInterface;

export default RPAServiceModule; 
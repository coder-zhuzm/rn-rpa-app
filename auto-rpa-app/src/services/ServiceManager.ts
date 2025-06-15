import { HttpService } from './http/HttpService';

/**
 * 服务管理器 - 负责统一管理和协调各种服务
 */
export class ServiceManager {
  private static instance: ServiceManager;
  private httpService: HttpService;

  private constructor() {
    this.httpService = HttpService.getInstance();
  }

  /**
   * 获取ServiceManager单例
   */
  public static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * 启动所有服务
   */
  public startAllServices(): void {
    console.log('启动所有服务...');

    // 启动HTTP服务
    this.startHttpService();

    console.log('所有服务启动完成');
  }

  /**
   * 停止所有服务
   */
  public stopAllServices(): void {
    console.log('停止所有服务...');

    // 停止HTTP服务
    this.stopHttpService();

    console.log('所有服务已停止');
  }

  /**
   * 启动HTTP服务
   * @param port 端口号
   * @returns 是否成功启动
   */
  public startHttpService(port: number = 8080): boolean {
    return this.httpService.start(port);
  }

  /**
   * 停止HTTP服务
   */
  public stopHttpService(): void {
    this.httpService.stop();
  }

  /**
   * 重启HTTP服务
   * @returns 是否成功重启
   */
  public restartHttpService(): boolean {
    return this.httpService.restart();
  }

  /**
   * 获取HTTP服务状态
   * @returns 是否运行中
   */
  public isHttpServiceRunning(): boolean {
    return this.httpService.isServerRunning();
  }

  /**
   * 获取HTTP服务端口
   * @returns 端口号
   */
  public getHttpServicePort(): number {
    return this.httpService.getPort();
  }
}

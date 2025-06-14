export interface RPAServiceModuleInterface {
  start(): void;
  launchSettings(): Promise<string>;
  launchWifiSettings(): Promise<string>;
  launchBluetoothSettings(): Promise<string>;
  launchAppByPackage(packageName: string): Promise<string>;
} 
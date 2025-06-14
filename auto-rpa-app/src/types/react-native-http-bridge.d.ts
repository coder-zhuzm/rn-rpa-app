declare module 'react-native-http-bridge' {
  interface HttpRequest {
    requestId: string;
    type: string;
    url: string;
    postData?: string;
    headers?: { [key: string]: string };
  }

  interface HttpBridge {
    start(port: number, serviceName: string, callback: (request: HttpRequest) => void): void;
    stop(): void;
    respond(
      requestId: string, 
      code: number, 
      type: string, 
      body: string, 
      headers?: { [key: string]: string }
    ): void;
  }

  const httpBridge: HttpBridge;
  export default httpBridge;
} 
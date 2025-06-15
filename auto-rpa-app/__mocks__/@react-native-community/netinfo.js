// Mock for @react-native-community/netinfo
export default {
  fetch: jest.fn(() =>
    Promise.resolve({
      type: 'wifi',
      isConnected: true,
      isInternetReachable: true,
      details: {
        isConnectionExpensive: false,
        ssid: 'MockWiFi',
        strength: 99,
        ipAddress: '192.168.1.100',
        subnet: '255.255.255.0',
      },
    }),
  ),

  addEventListener: jest.fn(() => jest.fn()),

  useNetInfo: jest.fn(() => ({
    type: 'wifi',
    isConnected: true,
    isInternetReachable: true,
    details: {
      isConnectionExpensive: false,
      ssid: 'MockWiFi',
      strength: 99,
      ipAddress: '192.168.1.100',
      subnet: '255.255.255.0',
    },
  })),

  configure: jest.fn(),

  refresh: jest.fn(() =>
    Promise.resolve({
      type: 'wifi',
      isConnected: true,
      isInternetReachable: true,
    }),
  ),
};

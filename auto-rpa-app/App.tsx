/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import NetInfo from '@react-native-community/netinfo';
import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

import { ScriptExecutor } from './src/components/ScriptExecutor';
import RPAServiceModule from './src/modules/RPAServiceModule';
import { ServiceManager } from './src/services/ServiceManager';

// 定义颜色常量
const Colors = {
  lighter: '#F3F3F3',
  darker: '#222222',
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [showScriptExecutor, setShowScriptExecutor] = useState(false);
  const [httpServerRunning, setHttpServerRunning] = useState(false);
  const [serverPort] = useState(8080);
  const [ipAddress, setIpAddress] = useState<string>('获取中...');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // 定义启动HTTP服务器函数
  const startHttpServer = useCallback(() => {
    const serviceManager = ServiceManager.getInstance();
    const success = serviceManager.startHttpService(serverPort);
    if (success) {
      setHttpServerRunning(true);
    }
  }, [serverPort]);

  // 定义停止HTTP服务器函数
  const stopHttpServer = useCallback(() => {
    const serviceManager = ServiceManager.getInstance();
    serviceManager.stopHttpService();
    setHttpServerRunning(false);
  }, []);

  // 获取设备IP地址
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const networkInfo = await NetInfo.fetch();
        if (networkInfo.type === 'wifi' && networkInfo.details) {
          setIpAddress(networkInfo.details.ipAddress || '未知');
        } else if (networkInfo.type === 'cellular' && networkInfo.details) {
          setIpAddress('移动网络 (使用WiFi获取更准确IP)');
        } else {
          setIpAddress('未连接网络');
        }
      } catch (error) {
        console.error('获取IP地址失败:', error);
        setIpAddress('获取失败');
      }
    };

    getIpAddress();
    // 监听网络状态变化
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.type === 'wifi' && state.details) {
        setIpAddress(state.details.ipAddress || '未知');
      } else if (state.type === 'cellular') {
        setIpAddress('移动网络 (使用WiFi获取更准确IP)');
      } else {
        setIpAddress('未连接网络');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 启动HTTP服务器
  useEffect(() => {
    startHttpServer();
    return () => {
      stopHttpServer();
    };
  }, [startHttpServer, stopHttpServer]);

  const handleStartRPA = () => {
    try {
      // 首先检查模块是否可用
      if (!RPAServiceModule) {
        Alert.alert('错误', 'RPAServiceModule 未找到，原生模块可能没有正确注册');
        return;
      }

      if (typeof RPAServiceModule.start !== 'function') {
        Alert.alert('错误', 'start 方法不可用');
        return;
      }

      RPAServiceModule.start();
      Alert.alert('成功', 'RPA 服务已启动，请查看日志');
    } catch (error) {
      Alert.alert('错误', `启动 RPA 服务失败: ${error}`);
    }
  };

  const handleLaunchSettings = async () => {
    try {
      // 检查方法是否可用
      if (!RPAServiceModule || typeof RPAServiceModule.launchSettings !== 'function') {
        Alert.alert('错误', 'launchSettings 方法不可用，请先构建原生模块');
        return;
      }

      const result = await RPAServiceModule.launchSettings();
      Alert.alert('成功', result);
    } catch (error) {
      Alert.alert('错误', `启动设置失败: ${error}`);
    }
  };

  const handleLaunchWifiSettings = async () => {
    try {
      const result = await RPAServiceModule.launchWifiSettings();
      Alert.alert('成功', result);
    } catch (error) {
      Alert.alert('错误', `启动 WiFi 设置失败: ${error}`);
    }
  };

  const handleLaunchBluetoothSettings = async () => {
    try {
      const result = await RPAServiceModule.launchBluetoothSettings();
      Alert.alert('成功', result);
    } catch (error) {
      Alert.alert('错误', `启动蓝牙设置失败: ${error}`);
    }
  };

  const handleLaunchCalculator = async () => {
    try {
      const result = await RPAServiceModule.launchAppByPackage('com.android.calculator2');
      Alert.alert('成功', result);
    } catch (error) {
      Alert.alert('错误', `启动计算器失败: ${error}`);
    }
  };

  const handleToggleHttpServer = () => {
    if (httpServerRunning) {
      stopHttpServer();
      Alert.alert('成功', 'HTTP服务器已停止');
    } else {
      startHttpServer();
      Alert.alert('成功', `HTTP服务器已启动，端口: ${serverPort}`);
    }
  };

  const handleRestartHttpServer = () => {
    const serviceManager = ServiceManager.getInstance();
    Alert.alert('确认重启', '确定要重启HTTP服务器吗？这将暂时中断连接。', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '重启',
        onPress: () => {
          serviceManager.restartHttpService();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={styles.container}>
          <Text style={styles.title}>RPA App</Text>
          <Text style={styles.subtitle}>React Native + Android 原生模块</Text>

          {/* HTTP服务器状态 */}
          <View style={styles.serverStatus}>
            <Text style={styles.serverStatusText}>
              HTTP服务器: {httpServerRunning ? '运行中' : '已停止'}
            </Text>
            {httpServerRunning && (
              <>
                <Text style={styles.serverPortText}>端口: {serverPort}</Text>
                <Text style={styles.serverIpText}>设备IP: {ipAddress}</Text>
                {ipAddress &&
                  ipAddress !== '获取中...' &&
                  ipAddress !== '获取失败' &&
                  ipAddress !== '未连接网络' &&
                  !ipAddress.includes('移动网络') && (
                    <Text style={styles.serverUrlText}>
                      访问地址: http://{ipAddress}:{serverPort}
                    </Text>
                  )}
              </>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStartRPA}>
            <Text style={styles.buttonText}>启动 RPA 服务</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, httpServerRunning ? styles.buttonDanger : styles.buttonSuccess]}
            onPress={handleToggleHttpServer}
          >
            <Text style={styles.buttonText}>
              {httpServerRunning ? '停止 HTTP 服务器' : '启动 HTTP 服务器'}
            </Text>
          </TouchableOpacity>

          {httpServerRunning && (
            <TouchableOpacity
              style={[styles.button, styles.buttonWarning]}
              onPress={handleRestartHttpServer}
            >
              <Text style={styles.buttonText}>🔄 重启 HTTP 服务器</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleLaunchSettings}
          >
            <Text style={styles.buttonText}>启动系统设置</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonTertiary]}
            onPress={handleLaunchWifiSettings}
          >
            <Text style={styles.buttonText}>启动 WiFi 设置</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonQuaternary]}
            onPress={handleLaunchBluetoothSettings}
          >
            <Text style={styles.buttonText}>启动蓝牙设置</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonQuinary]}
            onPress={handleLaunchCalculator}
          >
            <Text style={styles.buttonText}>启动计算器</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonScript]}
            onPress={() => setShowScriptExecutor(true)}
          >
            <Text style={styles.buttonText}>📜 脚本执行器</Text>
          </TouchableOpacity>

          <Text style={styles.description}>
            • 启动 RPA 服务：初始化 UI Automator 功能{'\n'}• HTTP
            服务器：接收来自Web页面的远程脚本执行请求{'\n'}• 启动系统设置：打开 Android 系统设置
            {'\n'}• 启动 WiFi 设置：直接打开 WiFi 设置页面{'\n'}• 启动蓝牙设置：直接打开蓝牙设置页面
            {'\n'}• 脚本执行器：动态加载和执行 JavaScript 脚本{'\n'}
            请查看 Android 日志获取详细信息
          </Text>
        </View>
      </ScrollView>

      <ScriptExecutor visible={showScriptExecutor} onClose={() => setShowScriptExecutor(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  serverStatus: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  serverStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serverPortText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  serverIpText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontWeight: 'bold',
  },
  serverUrlText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonSecondary: {
    backgroundColor: '#34C759',
  },
  buttonTertiary: {
    backgroundColor: '#FF9500',
  },
  buttonQuaternary: {
    backgroundColor: '#5856D6',
  },
  buttonQuinary: {
    backgroundColor: '#FF2D92',
  },
  buttonScript: {
    backgroundColor: '#8E44AD',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
  buttonWarning: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default App;

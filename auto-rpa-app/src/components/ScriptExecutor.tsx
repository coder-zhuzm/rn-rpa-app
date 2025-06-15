import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { ScriptManager, ScriptContext, ScriptResult } from '../managers/ScriptManager';
import RPAServiceModule from '../modules/RPAServiceModule';

import { ErrorDisplay } from './ErrorDisplay';

interface ScriptExecutorProps {
  visible: boolean;
  onClose: () => void;
}

export const ScriptExecutor: React.FC<ScriptExecutorProps> = ({ visible, onClose }) => {
  const [script, setScript] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [scriptResult, setScriptResult] = useState<ScriptResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleExecute = async () => {
    if (!script.trim()) {
      Alert.alert('错误', '请输入要执行的脚本');
      return;
    }

    setIsExecuting(true);
    setResult('正在执行...');
    setScriptResult(null);

    try {
      // 创建脚本执行上下文
      const context: ScriptContext = {
        RPAServiceModule,
        console,
        Alert,
      };

      // 执行脚本
      const scriptManager = ScriptManager.getInstance();
      const executionResult = await scriptManager.executeScript(script, context);

      // 保存完整的执行结果用于错误分析
      setScriptResult(executionResult);

      // 显示执行结果
      if (executionResult.success) {
        setResult(`✅ 执行成功:\n${JSON.stringify(executionResult.result, null, 2)}`);
      } else {
        setResult(`❌ 执行失败:\n${executionResult.error}`);
      }
    } catch (error) {
      // 构造错误结果对象
      const errorResult: ScriptResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
      };

      setScriptResult(errorResult);
      setResult(`💥 执行异常:\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClear = () => {
    setScript('');
    setResult('');
    setScriptResult(null);
  };

  const handleClose = () => {
    if (isExecuting) {
      Alert.alert('警告', '脚本正在执行中，确定要关闭吗？', [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: onClose },
      ]);
    } else {
      onClose();
    }
  };

  const loadExampleScript = () => {
    setScript(`// 示例脚本: 点击计算器按钮
const result = await RPAServiceModule.launchAppByPackage('com.android.calculator2');
console.log('启动计算器:', result);

// 等待应用启动
await new Promise(resolve => setTimeout(resolve, 2000));

// 点击数字按钮
await RPAServiceModule.clickByText('7');
await RPAServiceModule.clickByText('8');
await RPAServiceModule.clickByText('9');

// 点击加号
await RPAServiceModule.clickByText('+');

// 点击更多数字
await RPAServiceModule.clickByText('1');
await RPAServiceModule.clickByText('2');
await RPAServiceModule.clickByText('3');

// 点击等号
await RPAServiceModule.clickByText('=');

// 返回结果
return "计算器操作完成: 789 + 123";`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>脚本执行器</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scriptContainer}>
          <Text style={styles.label}>JavaScript 脚本:</Text>
          <TextInput
            style={styles.scriptInput}
            multiline
            value={script}
            onChangeText={setScript}
            placeholder="在此输入JavaScript脚本..."
            placeholderTextColor="#999"
            editable={!isExecuting}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.executeButton, isExecuting && styles.disabledButton]}
            onPress={handleExecute}
            disabled={isExecuting}
          >
            <Text style={styles.buttonText}>{isExecuting ? '执行中...' : '执行'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
            disabled={isExecuting}
          >
            <Text style={styles.buttonText}>清除</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.exampleButton]}
            onPress={loadExampleScript}
            disabled={isExecuting}
          >
            <Text style={styles.buttonText}>加载示例</Text>
          </TouchableOpacity>
        </View>

        {/* 错误展示组件 */}
        {scriptResult && !scriptResult.success && (
          <ErrorDisplay
            error={scriptResult}
            script={script}
            onDismiss={() => setScriptResult(null)}
          />
        )}

        <View style={styles.resultContainer}>
          <Text style={styles.label}>执行结果:</Text>
          <ScrollView style={styles.resultScroll}>
            <Text style={styles.resultText}>{result}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  scriptContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  scriptInput: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  executeButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  exampleButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
  },
  resultScroll: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ScriptResult } from '../managers/ScriptManager';
import { ScriptErrorAnalyzer } from '../utils/ScriptErrorAnalyzer';

interface ErrorDisplayProps {
  error: ScriptResult;
  script?: string;
  onDismiss?: () => void;
}

/**
 * 错误展示组件
 * 显示脚本执行错误的详细信息和解决建议
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, script, onDismiss }) => {
  if (error.success) {
    return null;
  }

  // 生成详细的错误分析
  const analysis = ScriptErrorAnalyzer.analyzeError(error.error || '未知错误', script);
  
  const showFullReport = () => {
    const report = ScriptErrorAnalyzer.generateErrorReport(error.error || '未知错误', script);
    Alert.alert('详细错误报告', report, [{ text: '确定' }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>❌ 脚本执行失败</Text>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* 错误类别 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 错误类别</Text>
          <Text style={styles.categoryText}>{analysis.category}</Text>
        </View>

        {/* 错误描述 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 错误描述</Text>
          <Text style={styles.descriptionText}>{analysis.description}</Text>
        </View>

        {/* 错误消息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ 错误消息</Text>
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>{error.error}</Text>
          </View>
        </View>

        {/* 解决建议 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 解决建议</Text>
          <Text style={styles.suggestionText}>{analysis.suggestion}</Text>
        </View>

        {/* 示例代码 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 示例代码</Text>
          {analysis.examples.map((example, index) => (
            <View key={index} style={styles.exampleContainer}>
              <Text style={styles.exampleText}>• {example}</Text>
            </View>
          ))}
        </View>

        {/* 调试信息 */}
        {error.errorType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 调试信息</Text>
            <Text style={styles.debugText}>错误类型: {error.errorType}</Text>
            {error.stack && (
              <TouchableOpacity 
                onPress={() => Alert.alert('错误堆栈', error.stack || '无堆栈信息')}
                style={styles.stackButton}
              >
                <Text style={styles.stackButtonText}>查看堆栈跟踪</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* 操作按钮 */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={showFullReport} style={styles.reportButton}>
          <Text style={styles.reportButtonText}>📊 查看完整报告</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fed7d7',
    borderRadius: 8,
    margin: 10,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7d7',
    backgroundColor: '#fee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  dismissButton: {
    padding: 5,
  },
  dismissText: {
    fontSize: 18,
    color: '#e53e3e',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#e53e3e',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
  },
  errorMessageContainer: {
    backgroundColor: '#fed7d7',
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#e53e3e',
  },
  errorMessage: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#742a2a',
  },
  suggestionText: {
    fontSize: 14,
    color: '#2b6cb0',
    lineHeight: 20,
    fontWeight: '500',
  },
  exampleContainer: {
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 13,
    color: '#4a5568',
    fontFamily: 'monospace',
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 4,
  },
  debugText: {
    fontSize: 13,
    color: '#4a5568',
    marginBottom: 10,
  },
  stackButton: {
    backgroundColor: '#edf2f7',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  stackButtonText: {
    fontSize: 12,
    color: '#2d3748',
  },
  actions: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#fed7d7',
    backgroundColor: '#fefefe',
  },
  reportButton: {
    backgroundColor: '#3182ce',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  reportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
}); 
// WiFi 设置启动脚本
// 通过 adb push 推送的外部脚本

console.log('🔧 WiFi 设置脚本开始执行');
console.log('脚本来源: adb push');
console.log('目标: 启动 WiFi 设置页面');

// 启动 WiFi 设置
RPAServiceModule.launchWifiSettings()
  .then(function (result) {
    console.log('✅ WiFi 设置启动成功:', result);

    const message = 'WiFi 设置已启动！\n' + '脚本来源: adb push\n' + '执行结果: ' + result;

    Alert.alert('WiFi 设置', message);
    return message;
  })
  .catch(function (error) {
    console.error('❌ WiFi 设置启动失败:', error);
    Alert.alert('错误', 'WiFi 设置启动失败: ' + error);
    throw error;
  });

// 实用函数脚本示例
// 这个脚本展示了如何在动态脚本中定义和使用辅助函数

console.log('🔧 加载实用函数脚本...');

// 定义辅助函数
function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function logWithTime(message) {
  const timestamp = formatTime(new Date());
  console.log('[' + timestamp + '] ' + message);
}

function createProgressBar(current, total, width) {
  if (typeof width === 'undefined') width = 20;
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;

  let filledStr = '';
  for (let i = 0; i < filled; i++) {
    filledStr += '█';
  }

  let emptyStr = '';
  for (let j = 0; j < empty; j++) {
    emptyStr += '░';
  }

  return '[' + filledStr + emptyStr + '] ' + percentage + '%';
}

// 主执行函数
return new Promise(function (resolve, reject) {
  try {
    logWithTime('开始执行实用函数演示');

    // 演示进度条
    const tasks = ['初始化系统', '检查权限', '启动服务', '执行任务', '清理资源'];

    logWithTime('准备执行 ' + tasks.length + ' 个任务');

    let currentTaskIndex = 0;

    // 递归执行任务
    function executeNextTask() {
      if (currentTaskIndex >= tasks.length) {
        // 所有任务完成，继续后续处理
        processAppData();
        return;
      }

      const task = tasks[currentTaskIndex];
      const progress = createProgressBar(currentTaskIndex + 1, tasks.length);

      logWithTime(progress + ' 正在执行: ' + task);

      // 模拟任务执行时间
      setTimeout(function () {
        logWithTime('✅ 完成: ' + task);
        currentTaskIndex++;
        executeNextTask();
      }, Math.random() * 1000 + 500);
    }

    // 处理应用数据函数
    function processAppData() {
      // 演示数据处理
      const testData = [
        { name: '设置', package: 'com.android.settings' },
        { name: '计算器', package: 'com.android.calculator2' },
        { name: '相机', package: 'com.android.camera2' },
      ];

      logWithTime('开始处理应用数据:');

      const processedData = [];
      for (let i = 0; i < testData.length; i++) {
        const app = testData[i];
        logWithTime('处理应用 ' + (i + 1) + ': ' + app.name);
        processedData.push({
          name: app.name,
          package: app.package,
          id: i + 1,
          processedAt: new Date().toISOString(),
          canLaunch: app.package.indexOf('android') !== -1,
        });
      }

      // 演示条件执行
      const launchableApps = [];
      for (let k = 0; k < processedData.length; k++) {
        if (processedData[k].canLaunch) {
          launchableApps.push(processedData[k]);
        }
      }
      logWithTime('找到 ' + launchableApps.length + ' 个可启动的应用');

      // 演示错误处理
      try {
        logWithTime('测试错误处理...');
        // 故意触发一个错误来演示错误处理
        if (Math.random() > 0.5) {
          throw new Error('这是一个演示错误');
        }
        logWithTime('✅ 错误处理测试通过');
      } catch (error) {
        logWithTime('⚠️ 捕获到错误: ' + error.message);
        logWithTime('✅ 错误已被正确处理');
      }

      // 生成最终报告
      const report = {
        executedAt: new Date().toISOString(),
        tasksCompleted: tasks.length,
        appsProcessed: processedData.length,
        launchableApps: launchableApps.length,
        executionTime: '模拟执行时间',
        status: 'success',
      };

      logWithTime('生成执行报告:');
      const reportKeys = Object.keys(report);
      for (let m = 0; m < reportKeys.length; m++) {
        const key = reportKeys[m];
        logWithTime('  ' + key + ': ' + report[key]);
      }

      Alert.alert(
        '实用函数演示完成',
        '成功执行了 ' + tasks.length + ' 个任务，处理了 ' + processedData.length + ' 个应用数据',
      );

      resolve({
        message: '实用函数脚本执行成功',
        report: report,
        processedData: processedData,
      });
    }

    // 开始执行任务
    executeNextTask();
  } catch (error) {
    logWithTime('❌ 脚本执行失败: ' + error.message);
    Alert.alert('执行失败', '实用函数脚本出错: ' + error.message);
    reject(error);
  }
});

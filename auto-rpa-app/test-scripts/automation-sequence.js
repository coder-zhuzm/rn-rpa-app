// 自动化序列脚本
// 演示复杂的自动化流程

console.log('🤖 自动化序列开始执行');
console.log('脚本来源: adb push');

const steps = ['启动 RPA 服务', '打开系统设置', '等待 2 秒', '启动计算器', '完成序列'];

let currentStep = 0;

function executeNextStep() {
  if (currentStep >= steps.length) {
    console.log('✅ 自动化序列完成');
    Alert.alert('完成', '自动化序列执行完成！');
    return Promise.resolve('序列完成');
  }

  const step = steps[currentStep];
  console.log('执行步骤 ' + (currentStep + 1) + ': ' + step);
  currentStep++;

  switch (currentStep) {
    case 1:
      // 启动 RPA 服务
      RPAServiceModule.start();
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve('RPA 服务已启动');
        }, 500);
      });

    case 2:
      // 打开系统设置
      return RPAServiceModule.launchSettings();

    case 3:
      // 等待 2 秒
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve('等待完成');
        }, 2000);
      });

    case 4:
      // 启动计算器
      return RPAServiceModule.launchAppByPackage('com.android.calculator2');

    case 5:
      // 完成
      return Promise.resolve('序列完成');

    default:
      return Promise.resolve('未知步骤');
  }
}

// 开始执行序列
function runSequence() {
  return executeNextStep()
    .then(function (result) {
      console.log('步骤结果:', result);
      if (currentStep < steps.length) {
        return runSequence();
      }
      return result;
    })
    .catch(function (error) {
      console.error('步骤失败:', error);
      Alert.alert('错误', '自动化序列在步骤 ' + currentStep + ' 失败: ' + error);
      throw error;
    });
}

// 启动序列
return runSequence();

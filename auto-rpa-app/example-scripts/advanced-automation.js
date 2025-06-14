// 高级自动化脚本示例
// 这个脚本演示了如何创建复杂的 RPA 自动化流程

console.log("🚀 开始执行高级自动化脚本...");

return new Promise(function(resolve, reject) {
  // 定义自动化步骤
  var steps = [
    {
      name: "初始化 RPA 服务",
      action: function() { return RPAServiceModule.start(); },
      delay: 1000
    },
    {
      name: "启动系统设置",
      action: function() { return RPAServiceModule.launchSettings(); },
      delay: 2000
    },
    {
      name: "启动 WiFi 设置",
      action: function() { return RPAServiceModule.launchWifiSettings(); },
      delay: 2000
    },
    {
      name: "启动蓝牙设置",
      action: function() { return RPAServiceModule.launchBluetoothSettings(); },
      delay: 2000
    },
    {
      name: "启动计算器应用",
      action: function() { return RPAServiceModule.launchAppByPackage('com.android.calculator2'); },
      delay: 1000
    }
  ]

  var results = [];
  var currentStep = 0;
  
  // 递归执行步骤
  function executeNextStep() {
    if (currentStep >= steps.length) {
      // 所有步骤完成，生成报告
      generateReport();
      return;
    }
    
    var step = steps[currentStep];
    console.log('📋 步骤 ' + (currentStep + 1) + '/' + steps.length + ': ' + step.name);
    
    // 执行步骤
    try {
      var actionResult = step.action();
      
      // 如果返回 Promise，等待完成
      if (actionResult && typeof actionResult.then === 'function') {
        actionResult
          .then(function(result) {
            results.push({
              step: step.name,
              success: true,
              result: result
            });
            console.log('✅ ' + step.name + ' - 成功: ' + result);
            
            // 等待后执行下一步
            if (step.delay && currentStep < steps.length - 1) {
              console.log('⏳ 等待 ' + step.delay + 'ms...');
              setTimeout(function() {
                currentStep++;
                executeNextStep();
              }, step.delay);
            } else {
              currentStep++;
              executeNextStep();
            }
          })
          .catch(function(error) {
            results.push({
              step: step.name,
              success: false,
              error: error.toString()
            });
            console.log('❌ ' + step.name + ' - 失败: ' + error);
            currentStep++;
            executeNextStep();
          });
      } else {
        // 同步操作
        results.push({
          step: step.name,
          success: true,
          result: actionResult
        });
        console.log('✅ ' + step.name + ' - 成功: ' + actionResult);
        
        if (step.delay && currentStep < steps.length - 1) {
          console.log('⏳ 等待 ' + step.delay + 'ms...');
          setTimeout(function() {
            currentStep++;
            executeNextStep();
          }, step.delay);
        } else {
          currentStep++;
          executeNextStep();
        }
      }
    } catch (error) {
      results.push({
        step: step.name,
        success: false,
        error: error.toString()
      });
      console.log('❌ ' + step.name + ' - 失败: ' + error);
      currentStep++;
      executeNextStep();
    }
  }
  
  // 生成报告函数
  function generateReport() {
    // 生成执行报告
    var successCount = results.filter(function(r) { return r.success; }).length;
    var failureCount = results.length - successCount;
    
    var report = '📊 自动化执行报告\n' +
      '==================\n' +
      '总步骤数: ' + results.length + '\n' +
      '成功: ' + successCount + '\n' +
      '失败: ' + failureCount + '\n' +
      '成功率: ' + Math.round((successCount / results.length) * 100) + '%\n\n' +
      '详细结果:\n' +
      results.map(function(r, i) {
        return (i + 1) + '. ' + r.step + ': ' + (r.success ? '✅ 成功' : '❌ 失败');
      }).join('\n');
    
    console.log(report);
    Alert.alert("自动化完成", "执行完成！成功 " + successCount + "/" + results.length + " 个步骤");
    
    resolve({
      summary: "自动化脚本执行完成，成功率: " + Math.round((successCount / results.length) * 100) + "%",
      results: results,
      report: report
    });
  }
  
  // 开始执行
  try {
    executeNextStep();
  } catch (error) {
    console.error("❌ 自动化脚本执行失败:", error);
    Alert.alert("执行失败", "脚本执行出错: " + error);
    reject(error);
  }
}); 
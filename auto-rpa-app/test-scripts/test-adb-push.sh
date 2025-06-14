#!/bin/bash

# ADB Push 脚本测试工具
# 用于快速测试外部脚本推送功能

echo "🚀 ADB Push 脚本测试工具"
echo "========================"

# 设备检查
echo "1. 检查设备连接..."
if ! adb devices | grep -q "emulator-5554"; then
    echo "❌ 设备未连接或未找到 emulator-5554"
    exit 1
fi
echo "✅ 设备连接正常"

# 创建外部脚本目录
echo "2. 创建外部脚本目录..."
adb -s emulator-5554 shell mkdir -p /sdcard/rpa-scripts
echo "✅ 外部脚本目录已创建"

# 检查现有脚本
echo "3. 检查现有外部脚本..."
adb -s emulator-5554 shell ls -la /sdcard/rpa-scripts/
echo ""

# 推送测试脚本
echo "4. 推送测试脚本..."
if [ -f "test-external-script.js" ]; then
    adb -s emulator-5554 push test-external-script.js /sdcard/rpa-scripts/
    echo "✅ test-external-script.js 推送成功"
fi

if [ -f "wifi-settings-script.js" ]; then
    adb -s emulator-5554 push wifi-settings-script.js /sdcard/rpa-scripts/
    echo "✅ wifi-settings-script.js 推送成功"
fi

if [ -f "automation-sequence.js" ]; then
    adb -s emulator-5554 push automation-sequence.js /sdcard/rpa-scripts/
    echo "✅ automation-sequence.js 推送成功"
fi

# 验证推送结果
echo "5. 验证推送结果..."
echo "外部脚本目录内容:"
adb -s emulator-5554 shell ls -la /sdcard/rpa-scripts/
echo ""

# 重启应用
echo "6. 重启应用以加载外部脚本..."
adb -s emulator-5554 shell am force-stop com.rpaapp
sleep 1
adb -s emulator-5554 shell am start -n com.rpaapp/.MainActivity
echo "✅ 应用已重启"

echo ""
echo "🎉 测试完成！"
echo "请在应用中点击 '脚本执行器' 查看外部脚本"
echo "外部脚本会显示 [外部] 标签"
echo ""
echo "📋 可用命令:"
echo "  查看日志: adb -s emulator-5554 logcat -s ReactNativeJS"
echo "  清理脚本: adb -s emulator-5554 shell rm -rf /sdcard/rpa-scripts/*"
echo "  查看脚本: adb -s emulator-5554 shell ls -la /sdcard/rpa-scripts/" 
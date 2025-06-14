package com.rpaapp

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.util.Log

/**
 * UI Automator 辅助类
 * 提供各种 UI 自动化功能
 */
class UIAutomatorHelper(private val context: Context) {

    companion object {
        private const val TAG = "UIAutomatorHelper"
    }

    /**
     * 启动系统设置应用
     */
    fun launchSettings(): Boolean {
        return try {
            Log.d(TAG, "Launching Settings app...")
            
            val intent = Intent(Settings.ACTION_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            
            context.startActivity(intent)
            
            // 等待应用启动
            Thread.sleep(2000)
            
            Log.d(TAG, "Settings app launched successfully")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch Settings app", e)
            false
        }
    }

    /**
     * 启动 WiFi 设置
     */
    fun launchWifiSettings(): Boolean {
        return try {
            Log.d(TAG, "Launching WiFi Settings...")
            
            val intent = Intent(Settings.ACTION_WIFI_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            
            context.startActivity(intent)
            Thread.sleep(2000)
            
            Log.d(TAG, "WiFi Settings launched successfully")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch WiFi Settings", e)
            false
        }
    }

    /**
     * 启动蓝牙设置
     */
    fun launchBluetoothSettings(): Boolean {
        return try {
            Log.d(TAG, "Launching Bluetooth Settings...")
            
            val intent = Intent(Settings.ACTION_BLUETOOTH_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            
            context.startActivity(intent)
            Thread.sleep(2000)
            
            Log.d(TAG, "Bluetooth Settings launched successfully")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch Bluetooth Settings", e)
            false
        }
    }

    /**
     * 启动应用设置
     */
    fun launchAppSettings(): Boolean {
        return try {
            Log.d(TAG, "Launching App Settings...")
            
            val intent = Intent(Settings.ACTION_APPLICATION_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            
            context.startActivity(intent)
            Thread.sleep(2000)
            
            Log.d(TAG, "App Settings launched successfully")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch App Settings", e)
            false
        }
    }

    /**
     * 通过包名启动应用
     */
    fun launchAppByPackage(packageName: String): Boolean {
        return try {
            Log.d(TAG, "Launching app with package: $packageName")
            
            val intent = context.packageManager.getLaunchIntentForPackage(packageName)
            
            if (intent != null) {
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                context.startActivity(intent)
                Thread.sleep(2000)
                
                Log.d(TAG, "App launched successfully: $packageName")
                true
            } else {
                Log.w(TAG, "No launch intent found for package: $packageName")
                false
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch app: $packageName", e)
            false
        }
    }

    /**
     * 获取当前前台应用包名
     */
    fun getCurrentPackage(): String? {
        return try {
            // 注意：在 Android 5.0+ 中，获取当前运行的应用需要特殊权限
            // 这里提供一个基础实现，实际使用可能需要额外的权限配置
            Log.d(TAG, "Getting current package name...")
            
            // 这个方法在实际应用中可能需要使用 UsageStatsManager
            // 或者其他方式来获取当前前台应用
            null
        } catch (e: Exception) {
            Log.e(TAG, "Failed to get current package", e)
            null
        }
    }
} 
package com.rpaapp

import android.content.Intent
import android.provider.Settings
import android.util.Log
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.UiDevice
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class RPAServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "RPAServiceModule"
        private const val MODULE_NAME = "RPAServiceModule"
    }

    private var uiDevice: UiDevice? = null
    private lateinit var uiAutomatorHelper: UIAutomatorHelper

    override fun getName(): String {
        return MODULE_NAME
    }

    @ReactMethod
    fun start() {
        Log.d(TAG, "RPA Service Started")
        initializeUIAutomator()
        uiAutomatorHelper = UIAutomatorHelper(reactApplicationContext)
    }

    @ReactMethod
    fun launchSettings(promise: Promise) {
        try {
            if (!::uiAutomatorHelper.isInitialized) {
                uiAutomatorHelper = UIAutomatorHelper(reactApplicationContext)
            }
            
            val success = uiAutomatorHelper.launchSettings()
            
            if (success) {
                promise.resolve("Settings app launched successfully")
            } else {
                promise.reject("LAUNCH_SETTINGS_ERROR", "Failed to launch Settings app")
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch Settings app", e)
            promise.reject("LAUNCH_SETTINGS_ERROR", "Failed to launch Settings app: ${e.message}", e)
        }
    }

    @ReactMethod
    fun launchWifiSettings(promise: Promise) {
        try {
            if (!::uiAutomatorHelper.isInitialized) {
                uiAutomatorHelper = UIAutomatorHelper(reactApplicationContext)
            }
            
            val success = uiAutomatorHelper.launchWifiSettings()
            
            if (success) {
                promise.resolve("WiFi Settings launched successfully")
            } else {
                promise.reject("LAUNCH_WIFI_SETTINGS_ERROR", "Failed to launch WiFi Settings")
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch WiFi Settings", e)
            promise.reject("LAUNCH_WIFI_SETTINGS_ERROR", "Failed to launch WiFi Settings: ${e.message}", e)
        }
    }

    @ReactMethod
    fun launchBluetoothSettings(promise: Promise) {
        try {
            if (!::uiAutomatorHelper.isInitialized) {
                uiAutomatorHelper = UIAutomatorHelper(reactApplicationContext)
            }
            
            val success = uiAutomatorHelper.launchBluetoothSettings()
            
            if (success) {
                promise.resolve("Bluetooth Settings launched successfully")
            } else {
                promise.reject("LAUNCH_BLUETOOTH_SETTINGS_ERROR", "Failed to launch Bluetooth Settings")
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch Bluetooth Settings", e)
            promise.reject("LAUNCH_BLUETOOTH_SETTINGS_ERROR", "Failed to launch Bluetooth Settings: ${e.message}", e)
        }
    }

    @ReactMethod
    fun launchAppByPackage(packageName: String, promise: Promise) {
        try {
            if (!::uiAutomatorHelper.isInitialized) {
                uiAutomatorHelper = UIAutomatorHelper(reactApplicationContext)
            }
            
            val success = uiAutomatorHelper.launchAppByPackage(packageName)
            
            if (success) {
                promise.resolve("App launched successfully: $packageName")
            } else {
                promise.reject("LAUNCH_APP_ERROR", "Failed to launch app: $packageName")
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Failed to launch app: $packageName", e)
            promise.reject("LAUNCH_APP_ERROR", "Failed to launch app: $packageName - ${e.message}", e)
        }
    }

    private fun initializeUIAutomator() {
        try {
            if (uiDevice == null) {
                // 注意：在实际应用中，UI Automator 通常需要在测试环境中运行
                // 这里我们提供一个基础的初始化，但可能需要额外的设置
                Log.d(TAG, "Initializing UI Automator...")
                // uiDevice = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())
                Log.d(TAG, "UI Automator initialization attempted")
            }
        } catch (e: Exception) {
            Log.w(TAG, "UI Automator initialization failed (this is expected in non-test environment): ${e.message}")
        }
    }
} 
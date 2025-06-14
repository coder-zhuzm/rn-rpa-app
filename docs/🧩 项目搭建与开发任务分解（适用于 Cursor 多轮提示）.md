好的，我们现在就来为你生成一组适合在 **Cursor 中多轮构建 React Native + Android RPA 系统**的完整提示词序列。你可以按阶段复制到 Cursor 逐步构建，并在每一步运行/调试后再进行下一步扩展。



------





## **🧩 项目搭建与开发任务分解（适用于 Cursor 多轮提示）**







### **✅ 第1步：初始化 React Native 项目 + Android 原生模块桥接**





> 请帮我创建一个 React Native 项目，并添加一个 Android 原生模块，命名为 RPAServiceModule。

> 我希望 JS 层可以调用这个模块，目前模块只需要暴露一个原生方法 start()，打印日志“RPA Service Started”。

> 后续我会扩展这个模块来执行 UI 自动化任务。请确保该模块在 Android 和 JS 层都已经注册并可以被调用。



------





### **✅ 第2步：封装 UI Automator 调用（原生侧）**





> 在上一步的 RPAServiceModule 原生模块中，帮我添加对 Android UI Automator 的基本封装，暴露一个函数 launchSettings()，可以自动打开系统“设置”页面。

> 我希望 JS 层调用 RPAServiceModule.launchSettings() 后就可以自动执行这个原生操作。

> 请同时更新 JS 端类型定义，并展示一个简单的调用示例（例如在按钮点击时触发）。



------





### **✅ 第3步：支持 JS 脚本文件动态加载和执行**





> 帮我扩展 JS 层功能，支持从本地文件系统（如 RNFS.DocumentDirectoryPath + '/scripts/'）动态读取并执行 JS 脚本内容。

> 这些 JS 文件会包含类似 RPAServiceModule.launchSettings() 这样的调用指令。

> 请帮我实现：



- > 创建脚本文件的加载函数（通过 react-native-fs）

- > 使用 eval() 或 Function 构造器执行 JS 内容

- > 提供一个示例脚本内容和调用演示





------





### **✅ 第4步：支持 adb push 脚本文件（脚本目录适配）**





> 帮我调整文件加载逻辑，支持通过 adb push 把 JS 脚本文件推入 App 的内部目录。

> 目标路径如 /data/data/${包名}/files/scripts/，或其他 React Native 可访问的路径。

> 请确保：



- > App 启动时自动扫描该目录并列出脚本

- > 提供如何 push 的 adb 命令

- > 调用该 JS 脚本的方法保持一致（eval 或 Function）





------





### **✅ 第5步：脚本保活与启动执行**





> 帮我设置 App 启动后自动执行某个固定路径下的 JS 脚本（如 main.js），模拟一个任务守护进程的行为。

> 我希望当 App 冷启动或热重启时，自动执行该 JS 脚本，实现初步的“保活+自动执行”机制。

> 可以用 AppState 或 Headless JS，只要能确保运行一段 JS 逻辑即可。



------





### **✅ 第6步：接入 MQTT 或 HTTP 远程任务接口**





> 请帮我接入一个 HTTP 和 MQTT 客户端模块，用于从远程接收 JS 脚本任务内容。

> 要求如下：



- > MQTT 可订阅某个 topic（如 rpa/task），收到消息即解析 JS 并执行

- > HTTP 接口支持定期轮询任务（可用 axios）

- > 收到任务时自动执行脚本

- > 请提供示例 MQTT 消息和调用代码





------





### **✅ 第7步：提供 Web 网页用于远程调试和触发任务**





> 帮我创建一个最简 Web 网页（可用 React 或 HTML），用于远程输入 JS 脚本，并通过 HTTP 调用 App 中的接口执行该脚本。

> 要求：



- > 页面包含 textarea 输入框和“执行”按钮

- > 页面通过 fetch/post 将脚本内容发送给本地/远程 App 接口

- > App 接口收到后执行该脚本内容





------





## **💬 后续扩展建议（可选）**





- 脚本安全沙箱机制（避免注入）
- JS 脚本调试日志回传
- 权限自动申请（Accessibility + 无障碍）
- UI 控制库封装（clickByText, scrollToView 等）
- RPA 流程可视化调度器（长期目标）





------



是否要我把这些提示导出为 markdown 文档、或以表格形式整理，方便你在 Cursor 项目中查阅和管理？
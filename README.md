# 每日健康（wellness-reminder）

一个 iOS / Android 提醒 app。三件事：

- **作息提醒**：每天定时提醒起床、睡觉。
- **保健品提醒**：可添加多个保健品，各自设定时间。
- **每日名言**：每天换一句，并可定时推送提醒。

所有提醒是手机**本地通知**，不需要联网，不需要服务器，关闭 app 也会按时弹出。

技术栈：Expo（React Native）。在 Windows 上开发，iOS 安装包用 Expo 的 EAS 云端服务打包，**不需要 Mac**。

---

## 一、本地开发运行

```bash
npm install
npx expo start
```

手机装 **Expo Go**（App Store 搜 "Expo Go"），和电脑连同一个 Wi-Fi，扫终端里的二维码即可预览。本地定时通知在 Expo Go 里就能测。

> 注意：iOS 模拟器只能在 Mac 上跑。Windows 上用真机 + Expo Go 测试。

---

## 二、打包 iOS 安装包（云端，无需 Mac）

1. 注册一个免费的 Expo 账号：<https://expo.dev>
2. 安装并登录：
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. 关联项目（第一次会自动在 Expo 后台创建项目并写入 projectId）：
   ```bash
   eas build:configure
   ```
4. 云端构建 iOS：
   ```bash
   eas build --platform ios --profile production
   ```
   - 第一次会问 Apple 账号，用来生成证书和描述文件。**这一步必须有 Apple Developer 账号（99 美元/年）。**
   - 构建在 Expo 服务器上跑，完成后给一个 `.ipa` 下载链接。

> 只想先在自己 iPhone 上装来用、不上架：把上面 `--profile production` 换成 `--profile preview`，并先用 `eas device:create` 注册你的设备。同样需要 Apple Developer 账号才能签名到真机。

---

## 三、上架 App Store

1. 在 <https://developer.apple.com> 注册 Apple Developer Program（99 美元/年）。
2. 在 <https://appstoreconnect.apple.com> 新建一个 App，填好名称、分类、隐私说明（这个 app 不收集任何数据，隐私问卷选"不收集"即可）。
3. 上传构建好的包：
   ```bash
   eas submit --platform ios --profile production
   ```
4. 在 App Store Connect 里填截图、描述，提交审核。审核一般 1～3 天。

---

## 四、维护在 GitHub

仓库地址：在 `zexichen1407-code` 账号下。

日常改完代码后：

```bash
git add .
git commit -m "说明这次改了什么"
git push
```

---

## 文件结构

| 文件 | 作用 |
| --- | --- |
| `App.js` | 主界面：作息 / 保健品 / 名言 的设置 UI 和状态 |
| `notifications.js` | 申请权限、安排每日重复的本地通知 |
| `quotes.js` | 内置名言列表，按当天日期轮换 |
| `app.json` | Expo 配置（应用名、bundle id、通知插件） |
| `eas.json` | EAS 云端构建配置 |

## 怎么改

- **加名言**：编辑 `quotes.js` 里的 `QUOTES` 数组，加字符串就行。
- **改默认时间**：编辑 `App.js` 里的 `DEFAULT_SETTINGS`。
- **改提醒文案**：编辑 `notifications.js` 里 `rescheduleAll` 的标题和正文。

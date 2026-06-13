# 每日健康

自己用的一个小 app。三件事：提醒我早睡早起、提醒我按时吃保健品、每天给我推一句名言。

起因很简单，我老熬夜，保健品也总是买了就忘记吃，干脆自己写一个盯着我。

## 功能

- 起床、睡觉定点提醒，时间自己设
- 保健品提醒，可以加好几种，每种单独设时间
- 每天换一句名言，也能定时推送

提醒都是手机本地通知，不用联网、不用注册账号，就算把 app 关了到点也会响。

## 本地跑

用 Expo（React Native）写的。

```bash
npm install
npx expo start
```

手机装个 Expo Go，扫一下终端里的二维码就能看。

## 打包和上架

iOS 用 EAS 云端打包，不用 Mac：

```bash
npm i -g eas-cli
eas login
eas build -p ios
```

上架 App Store 要有 Apple 开发者账号（99 美元/年），打完包用 `eas submit -p ios` 提交。

## 代码

- `App.js` — 界面和所有逻辑
- `notifications.js` — 通知调度
- `quotes.js` — 名言库，想加就往数组里塞

名言、默认时间、提醒文案都在这几个文件里，直接改就行。

# 每日健康 · Wellness Reminder

> 一个轻量 iOS app,用本地通知管好每天的健康习惯:起床/睡眠、保健品、每日一句。无需账号、无需联网。

## 功能

- **作息提醒** —— 设定起床与睡觉时间,准点提醒。
- **保健品提醒** —— 可添加多种,每种单独设定时间。
- **每日一句** —— 每天一句励志名言,可定时推送。
- **本地通知** —— 提醒在设备本地触发,关掉 app 也照常响。

## 技术栈

| 模块 | 选型 |
|------|------|
| 框架 | Expo · React Native |
| 存储 | AsyncStorage(本地) |
| 通知 | expo-notifications |
| 构建与提交 | EAS |

## 快速开始

```bash
npm install
npx expo start
```

用 Expo Go 扫描终端中的二维码,或运行开发构建。

## 构建与上架(iOS)

```bash
npm i -g eas-cli
eas login
eas build -p ios
eas submit -p ios
```

上架 App Store 需要 Apple 开发者账号($99/年)。

## 代码结构

- `App.js` —— 界面与应用逻辑
- `notifications.js` —— 通知调度
- `quotes.js` —— 名言库(往数组里追加即可扩展)

---

# Wellness Reminder

> A lightweight iOS app that keeps daily wellness habits on track — wake/sleep times, supplements, and a daily quote — entirely through local notifications. No account, no network required.

## Features

- **Routine reminders** — set your wake-up and bedtime, and get nudged on schedule.
- **Supplement reminders** — add multiple supplements, each on its own schedule.
- **Daily quote** — a new line of motivation each day, optionally pushed at a set time.
- **On-device notifications** — reminders fire locally and still work with the app closed.

## Tech Stack

| Area | Choice |
|------|--------|
| Framework | Expo · React Native |
| Storage | AsyncStorage (local) |
| Notifications | expo-notifications |
| Build & submit | EAS |

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code from the terminal with Expo Go, or run a development build.

## Build & Release (iOS)

```bash
npm i -g eas-cli
eas login
eas build -p ios
eas submit -p ios
```

Publishing to the App Store requires an Apple Developer account ($99/year).

## Project Layout

- `App.js` — UI and app logic
- `notifications.js` — notification scheduling
- `quotes.js` — quote library (extend the array to add more)

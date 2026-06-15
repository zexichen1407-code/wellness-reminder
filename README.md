# 每日健康 · Wellness Reminder

A lightweight iOS app that keeps daily wellness habits on track — wake/sleep times, supplement doses, and a daily quote — entirely through local notifications. No account, no network required.

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

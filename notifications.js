import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 通知在前台时也弹出横幅。模块级设置，App 启动时执行一次。
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 请求通知权限，返回是否已授权。
export async function requestPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: '默认',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: asked } = await Notifications.requestPermissionsAsync();
  return asked === 'granted';
}

// 安排一条每天重复的通知，返回它的 id。
async function scheduleDaily(title, body, hour, minute) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

// 根据当前设置，清空并重新安排所有提醒。
// 每次设置变化都调用，逻辑简单且不会重复。
export async function rescheduleAll(settings) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { wake, sleep, quote, supplements } = settings;

  if (wake.enabled) {
    await scheduleDaily('该起床啦 ☀️', '新的一天开始了，起来活动一下吧。', wake.hour, wake.minute);
  }
  if (sleep.enabled) {
    await scheduleDaily('该睡觉了 🌙', '早点休息，明天才有精神。', sleep.hour, sleep.minute);
  }
  if (quote.enabled) {
    await scheduleDaily('今日名言 ✨', '今天的名言已更新，打开看看吧。', quote.hour, quote.minute);
  }
  for (const s of supplements) {
    if (s.enabled) {
      await scheduleDaily('该吃保健品了 💊', `记得吃：${s.name}`, s.hour, s.minute);
    }
  }
}

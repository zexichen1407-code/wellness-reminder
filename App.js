import { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Switch,
  Pressable,
  TextInput,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDailyQuote } from './quotes';
import { requestPermissions, rescheduleAll } from './notifications';

const STORAGE_KEY = 'wellness.settings.v1';

const DEFAULT_SETTINGS = {
  wake: { enabled: true, hour: 7, minute: 0 },
  sleep: { enabled: true, hour: 22, minute: 30 },
  quote: { enabled: true, hour: 8, minute: 0 },
  supplements: [{ id: 's1', name: '维生素', enabled: true, hour: 9, minute: 0 }],
};

const pad = (n) => String(n).padStart(2, '0');
const fmt = (h, m) => `${pad(h)}:${pad(m)}`;

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [permissionOk, setPermissionOk] = useState(true);
  // picker: { target, date }  target = 'wake' | 'sleep' | 'quote' | 供品 id
  const [picker, setPicker] = useState(null);

  // 启动：加载设置 + 申请权限。
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSettings(JSON.parse(raw));
      } catch {}
      const ok = await requestPermissions();
      setPermissionOk(ok);
      setLoaded(true);
    })();
  }, []);

  // 设置变化后：保存 + 重新安排提醒。
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {});
    rescheduleAll(settings).catch(() => {});
  }, [settings, loaded]);

  const setBlock = useCallback((key, patch) => {
    setSettings((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  }, []);

  const setSupplement = useCallback((id, patch) => {
    setSettings((s) => ({
      ...s,
      supplements: s.supplements.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));
  }, []);

  const addSupplement = useCallback(() => {
    setSettings((s) => ({
      ...s,
      supplements: [
        ...s.supplements,
        { id: 's' + Date.now(), name: '新保健品', enabled: true, hour: 9, minute: 0 },
      ],
    }));
  }, []);

  const removeSupplement = useCallback((id) => {
    setSettings((s) => ({ ...s, supplements: s.supplements.filter((x) => x.id !== id) }));
  }, []);

  // 打开时间选择器。
  const openPicker = (target, hour, minute) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    setPicker({ target, date: d });
  };

  // 应用选中的时间到对应设置。
  const applyTime = (target, date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (target === 'wake' || target === 'sleep' || target === 'quote') {
      setBlock(target, { hour, minute });
    } else {
      setSupplement(target, { hour, minute });
    }
  };

  const onPickerChange = (event, date) => {
    if (Platform.OS === 'android') {
      // 安卓是原生对话框：选定即应用并关闭。
      setPicker(null);
      if (event.type === 'set' && date) applyTime(picker.target, date);
    } else if (date) {
      // iOS：滚轮实时更新到临时状态，由“完成”按钮确认。
      setPicker((p) => ({ ...p, date }));
    }
  };

  const quote = getDailyQuote();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.appTitle}>每日健康</Text>

        {/* 今日名言 */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>今日名言</Text>
          <Text style={styles.quoteText}>{quote}</Text>
        </View>

        {!permissionOk && (
          <Pressable
            style={styles.warn}
            onPress={async () => setPermissionOk(await requestPermissions())}
          >
            <Text style={styles.warnText}>
              未授予通知权限，提醒无法弹出。点此重新申请（或到系统设置里手动开启）。
            </Text>
          </Pressable>
        )}

        {/* 作息 */}
        <Text style={styles.section}>作息提醒</Text>
        <View style={styles.card}>
          <Row
            label="起床"
            time={fmt(settings.wake.hour, settings.wake.minute)}
            enabled={settings.wake.enabled}
            onToggle={(v) => setBlock('wake', { enabled: v })}
            onTime={() => openPicker('wake', settings.wake.hour, settings.wake.minute)}
          />
          <Divider />
          <Row
            label="睡觉"
            time={fmt(settings.sleep.hour, settings.sleep.minute)}
            enabled={settings.sleep.enabled}
            onToggle={(v) => setBlock('sleep', { enabled: v })}
            onTime={() => openPicker('sleep', settings.sleep.hour, settings.sleep.minute)}
          />
        </View>

        {/* 保健品 */}
        <Text style={styles.section}>保健品提醒</Text>
        <View style={styles.card}>
          {settings.supplements.length === 0 && (
            <Text style={styles.empty}>还没有保健品，点下面添加。</Text>
          )}
          {settings.supplements.map((s, i) => (
            <View key={s.id}>
              {i > 0 && <Divider />}
              <View style={styles.suppRow}>
                <TextInput
                  style={styles.suppName}
                  value={s.name}
                  onChangeText={(t) => setSupplement(s.id, { name: t })}
                  placeholder="名称"
                  placeholderTextColor="#9aa5b1"
                />
                <Pressable onPress={() => openPicker(s.id, s.hour, s.minute)}>
                  <Text style={styles.time}>{fmt(s.hour, s.minute)}</Text>
                </Pressable>
                <Switch
                  value={s.enabled}
                  onValueChange={(v) => setSupplement(s.id, { enabled: v })}
                  trackColor={{ true: '#34c1a0' }}
                />
                <Pressable onPress={() => removeSupplement(s.id)} hitSlop={8}>
                  <Text style={styles.del}>✕</Text>
                </Pressable>
              </View>
            </View>
          ))}
          <Pressable style={styles.addBtn} onPress={addSupplement}>
            <Text style={styles.addText}>＋ 添加保健品</Text>
          </Pressable>
        </View>

        {/* 名言提醒 */}
        <Text style={styles.section}>名言提醒</Text>
        <View style={styles.card}>
          <Row
            label="每日推送名言"
            time={fmt(settings.quote.hour, settings.quote.minute)}
            enabled={settings.quote.enabled}
            onToggle={(v) => setBlock('quote', { enabled: v })}
            onTime={() => openPicker('quote', settings.quote.hour, settings.quote.minute)}
          />
        </View>

        <Text style={styles.footer}>提醒为手机本地通知，无需联网，关闭 app 也会按时弹出。</Text>
      </ScrollView>

      {/* iOS 用弹层包住滚轮，安卓直接渲染原生对话框 */}
      {picker && Platform.OS === 'ios' && (
        <Modal transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <DateTimePicker
                value={picker.date}
                mode="time"
                display="spinner"
                onChange={onPickerChange}
              />
              <Pressable
                style={styles.doneBtn}
                onPress={() => {
                  applyTime(picker.target, picker.date);
                  setPicker(null);
                }}
              >
                <Text style={styles.doneText}>完成</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
      {picker && Platform.OS === 'android' && (
        <DateTimePicker value={picker.date} mode="time" onChange={onPickerChange} />
      )}
    </SafeAreaView>
  );
}

function Row({ label, time, enabled, onToggle, onTime }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Pressable onPress={onTime}>
          <Text style={styles.time}>{time}</Text>
        </Pressable>
        <Switch value={enabled} onValueChange={onToggle} trackColor={{ true: '#34c1a0' }} />
      </View>
    </View>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f6f8' },
  scroll: { padding: 16, paddingBottom: 40 },
  appTitle: { fontSize: 28, fontWeight: '700', color: '#1f2933', marginTop: 8, marginBottom: 16 },

  quoteCard: { backgroundColor: '#2bb6a3', borderRadius: 16, padding: 20, marginBottom: 8 },
  quoteLabel: { color: '#d6fff7', fontSize: 13, marginBottom: 8 },
  quoteText: { color: '#fff', fontSize: 18, lineHeight: 28, fontWeight: '600' },

  warn: { backgroundColor: '#ffe9e0', borderRadius: 12, padding: 12, marginTop: 8 },
  warnText: { color: '#a8400f', fontSize: 13, lineHeight: 19 },

  section: { fontSize: 15, fontWeight: '600', color: '#52606d', marginTop: 22, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16 },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  rowLabel: { fontSize: 17, color: '#1f2933' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  time: { fontSize: 17, color: '#2bb6a3', fontWeight: '600', fontVariant: ['tabular-nums'] },

  suppRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  suppName: { flex: 1, fontSize: 17, color: '#1f2933', paddingVertical: 2 },
  del: { fontSize: 16, color: '#c0392b', paddingHorizontal: 2 },
  empty: { color: '#9aa5b1', paddingVertical: 14, fontSize: 15 },

  addBtn: { paddingVertical: 14 },
  addText: { color: '#2bb6a3', fontSize: 16, fontWeight: '600' },

  divider: { height: 1, backgroundColor: '#eef2f4' },
  footer: { color: '#9aa5b1', fontSize: 12, lineHeight: 18, marginTop: 24, textAlign: 'center' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16 },
  doneBtn: { backgroundColor: '#2bb6a3', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  doneText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});

import { useState, useEffect, useRef } from 'react'
import type { PrayerKey, PrayerSchedule } from '../utils/prayerUtils'
import { PRAYER_META, COUNTABLE_PRAYERS, parseTimeToday } from '../utils/prayerUtils'

export interface NotificationSettings {
  enabled: boolean
  reminderMinutes: number
  enabledPrayers: PrayerKey[]
  azanEnabled: boolean
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderMinutes: 5,
  enabledPrayers: ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'],
  azanEnabled: true,
}

function loadSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem('notification_settings')
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS
}

export function useNotifications(schedule: PrayerSchedule | null) {
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings)
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  )
  const scheduledRef = useRef<Set<string>>(new Set())

  const saveSettings = (s: NotificationSettings) => {
    setSettings(s)
    localStorage.setItem('notification_settings', JSON.stringify(s))
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false
    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }

  const toggleEnabled = async () => {
    if (!settings.enabled) {
      const granted = await requestPermission()
      if (granted) saveSettings({ ...settings, enabled: true })
    } else {
      saveSettings({ ...settings, enabled: false })
    }
  }

  // Schedule notifications for today's prayers
  useEffect(() => {
    if (!settings.enabled || permission !== 'granted' || !schedule) return

    const now = new Date()
    const todayKey = now.toDateString()

    COUNTABLE_PRAYERS.forEach(key => {
      if (!settings.enabledPrayers.includes(key)) return

      const pTime = parseTimeToday(schedule[key])
      if (!pTime) return

      // Reminder notification
      const reminderTime = new Date(pTime.getTime() - settings.reminderMinutes * 60 * 1000)
      const notifKey = `${todayKey}-${key}-reminder`

      if (reminderTime > now && !scheduledRef.current.has(notifKey)) {
        scheduledRef.current.add(notifKey)
        const delay = reminderTime.getTime() - now.getTime()
        setTimeout(() => {
          new Notification(`⏰ ${PRAYER_META[key].nameMs} dalam ${settings.reminderMinutes} minit`, {
            body: `Waktu solat ${PRAYER_META[key].nameMs} akan tiba sebentar lagi`,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: notifKey,
          })
        }, delay)
      }

      // On-time notification
      const onTimeKey = `${todayKey}-${key}-ontime`
      if (pTime > now && !scheduledRef.current.has(onTimeKey)) {
        scheduledRef.current.add(onTimeKey)
        const delay = pTime.getTime() - now.getTime()
        setTimeout(() => {
          new Notification(`🕌 Waktu Solat ${PRAYER_META[key].nameMs}`, {
            body: `Telah masuk waktu solat ${PRAYER_META[key].nameMs}`,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: onTimeKey,
          })
        }, delay)
      }
    })
  }, [schedule, settings, permission])

  return {
    settings,
    saveSettings,
    permission,
    requestPermission,
    toggleEnabled,
  }
}

import { useRef, useEffect, useCallback } from 'react'
import type { PrayerKey } from '../utils/prayerUtils'
import { parseTimeToday, COUNTABLE_PRAYERS } from '../utils/prayerUtils'
import type { PrayerSchedule } from '../utils/prayerUtils'

// Public domain azan audio URLs (hosted on CDN)
const AZAN_SUBUH_URL = 'https://cdn.islamic.network/prayer-times/audio/Mishary_Rashid_Al_Afasy/1.mp3'
const AZAN_NORMAL_URL = 'https://cdn.islamic.network/prayer-times/audio/Mishary_Rashid_Al_Afasy/1.mp3'

export function useAzan(schedule: PrayerSchedule | null, azanEnabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const firedRef = useRef<Set<string>>(new Set())
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  const play = useCallback(async (key: PrayerKey) => {
    if (!azanEnabled) return
    stop()
    const url = key === 'fajr' ? AZAN_SUBUH_URL : AZAN_NORMAL_URL
    try {
      const audio = new Audio(url)
      audio.volume = 0.7
      audioRef.current = audio
      await audio.play()
    } catch {
      // Auto-play blocked — user interaction required
    }
  }, [azanEnabled, stop])

  useEffect(() => {
    // Clear old timers
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    if (!schedule || !azanEnabled) return

    const now = new Date()
    const todayKey = now.toDateString()

    COUNTABLE_PRAYERS.forEach(key => {
      const pTime = parseTimeToday(schedule[key])
      if (!pTime) return

      const notifKey = `${todayKey}-${key}-azan`
      if (pTime > now && !firedRef.current.has(notifKey)) {
        const delay = pTime.getTime() - now.getTime()
        const t = setTimeout(() => {
          firedRef.current.add(notifKey)
          play(key)
        }, delay)
        timersRef.current.push(t)
      }
    })

    return () => {
      timersRef.current.forEach(clearTimeout)
    }
  }, [schedule, azanEnabled, play])

  return { stop, play }
}

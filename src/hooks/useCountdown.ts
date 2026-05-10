import { useState, useEffect, useRef } from 'react'
import { getSyncedNow } from '../services/timeSync'
import {
  findNextPrayer,
  findCurrentPrayer,
  formatCountdown,
  type PrayerKey,
  type PrayerSchedule,
} from '../utils/prayerUtils'

export interface CountdownState {
  nextPrayer: PrayerKey | null
  nextPrayerTime: Date | null
  currentPrayer: PrayerKey | null
  countdown: string
  msRemaining: number
  now: Date
}

export function useCountdown(schedule: PrayerSchedule | null): CountdownState {
  const [state, setState] = useState<CountdownState>({
    nextPrayer: null,
    nextPrayerTime: null,
    currentPrayer: null,
    countdown: '00:00:00',
    msRemaining: 0,
    now: getSyncedNow(),
  })

  const rafRef = useRef<number>()

  useEffect(() => {
    let last = 0

    const tick = (ts: number) => {
      if (ts - last >= 1000) {
        last = ts
        const now = getSyncedNow()
        const next = findNextPrayer(schedule, now)
        const current = findCurrentPrayer(schedule, now)
        const msRemaining = next ? next.time.getTime() - now.getTime() : 0

        setState({
          nextPrayer: next?.key ?? null,
          nextPrayerTime: next?.time ?? null,
          currentPrayer: current,
          countdown: formatCountdown(msRemaining),
          msRemaining,
          now,
        })
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [schedule])

  return state
}

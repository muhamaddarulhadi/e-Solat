import { useState, useEffect, useCallback } from 'react'
import { fetchPrayerTimes } from '../services/prayerApi'
import type { Period } from '../services/prayerApi'
import type { PrayerSchedule } from '../utils/prayerUtils'
import { DEFAULT_ZONE } from '../utils/zones'

export function usePrayerTimes(zone: string, period: Period) {
  const [data, setData]       = useState<PrayerSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPrayerTimes(zone || DEFAULT_ZONE, period)
      setData(result.prayerTime ?? [])
    } catch (err) {
      setError('Gagal mendapatkan waktu solat. Sila periksa sambungan internet anda.')
    } finally {
      setLoading(false)
    }
  }, [zone, period])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}

export function useTodayPrayer(zone: string): {
  today: PrayerSchedule | null
  loading: boolean
  error: string | null
  refetch: () => void
} {
  const { data, loading, error, refetch } = usePrayerTimes(zone, 'today')
  return { today: data[0] ?? null, loading, error, refetch }
}

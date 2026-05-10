import axios from 'axios'
import type { PrayerSchedule } from '../utils/prayerUtils'

// ── Target API ────────────────────────────────────────────────────────────────
const ESOLAT_BASE = 'https://www.e-solat.gov.my/index.php'

/**
 * In dev:  Vite proxy rewrites /api/solat → https://www.e-solat.gov.my/index.php
 * In prod: route through corsproxy.io (free, no key needed)
 *          because the e-solat server does not send CORS headers for cross-origin requests.
 */
function buildUrl(params: Record<string, string>): string {
  const qs = new URLSearchParams(params).toString()

  if (import.meta.env.DEV) {
    // Vite proxy in vite.config.ts handles /api/solat → ESOLAT_BASE
    return `/api/solat?${qs}`
  }

  // Production: pass the full target URL through the CORS proxy
  const target = `${ESOLAT_BASE}?${qs}`
  return `https://corsproxy.io/?${encodeURIComponent(target)}`
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type Period = 'today' | 'week' | 'month' | 'year'

export interface ApiResponse {
  prayerTime: PrayerSchedule[]
  zone: string
  bearing: string
  serverTime: string
  periodType: string
  lang: string
  status: string
  error: string
}

// ── In-memory cache ───────────────────────────────────────────────────────────
const cache = new Map<string, { data: ApiResponse; ts: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

// ── Main fetch ────────────────────────────────────────────────────────────────
export async function fetchPrayerTimes(zone: string, period: Period): Promise<ApiResponse> {
  const key = `${zone}-${period}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data

  const url = buildUrl({
    r: 'esolatApi/takwimsolat',
    period,
    zone,
  })

  try {
    const res = await axios.get<ApiResponse>(url, { timeout: 15_000 })
    const data = res.data

    if (data?.prayerTime?.length) {
      cache.set(key, { data, ts: Date.now() })
      try {
        localStorage.setItem(`prayer_${key}`, JSON.stringify({ data, ts: Date.now() }))
      } catch { /* quota full */ }
      return data
    }
    throw new Error('Empty prayerTime in response')
  } catch (err) {
    // Offline fallback — try localStorage
    try {
      const stored = localStorage.getItem(`prayer_${key}`)
      if (stored) {
        const parsed = JSON.parse(stored) as { data: ApiResponse; ts: number }
        if (parsed.data?.prayerTime?.length) return parsed.data
      }
    } catch { /* parse error */ }
    throw err
  }
}

export async function fetchTodayPrayer(zone: string): Promise<PrayerSchedule | null> {
  const result = await fetchPrayerTimes(zone, 'today')
  return result.prayerTime?.[0] ?? null
}

// Used by timeSync — lightweight call to get server timestamp
export async function getServerTime(): Promise<Date> {
  try {
    const before = Date.now()
    const url = buildUrl({ r: 'esolatApi/takwimsolat', period: 'today', zone: 'WLY01' })
    const res = await axios.get<ApiResponse>(url, { timeout: 8_000 })
    const latency = (Date.now() - before) / 2
    if (res.data?.serverTime) {
      return new Date(new Date(res.data.serverTime).getTime() + latency)
    }
  } catch { /* ignore */ }
  return new Date()
}

export function clearCache(): void {
  cache.clear()
}

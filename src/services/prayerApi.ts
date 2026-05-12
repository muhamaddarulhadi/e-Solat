import axios from 'axios'
import type { PrayerSchedule } from '../utils/prayerUtils'

// ── Target API ────────────────────────────────────────────────────────────────
const ESOLAT_BASE = 'https://www.e-solat.gov.my/index.php'

// Multiple CORS proxies — tried in order on failure
const CORS_PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
]

function buildUrl(params: Record<string, string>, proxyIndex = 0): string {
  const qs = new URLSearchParams(params).toString()

  if (import.meta.env.DEV) {
    return `/api/solat?${qs}`
  }

  const target = `${ESOLAT_BASE}?${qs}`
  const proxy = CORS_PROXIES[proxyIndex % CORS_PROXIES.length]
  return proxy(target)
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

// ── Fetch with retry across multiple CORS proxies ─────────────────────────────
async function fetchWithRetry(params: Record<string, string>): Promise<ApiResponse> {
  let lastErr: unknown

  for (let attempt = 0; attempt < CORS_PROXIES.length + 1; attempt++) {
    const url = buildUrl(params, attempt)
    try {
      const res = await axios.get<ApiResponse>(url, { timeout: 15_000 })
      if (res.data?.prayerTime?.length) return res.data
      throw new Error('Empty prayerTime in response')
    } catch (err) {
      lastErr = err
      // Small delay before trying the next proxy
      if (attempt < CORS_PROXIES.length) {
        await new Promise(r => setTimeout(r, 1000))
      }
    }
  }

  throw lastErr
}

// ── Main fetch ────────────────────────────────────────────────────────────────
export async function fetchPrayerTimes(zone: string, period: Period): Promise<ApiResponse> {
  const key = `${zone}-${period}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data

  const params = { r: 'esolatApi/takwimsolat', period, zone }

  try {
    const data = await fetchWithRetry(params)
    cache.set(key, { data, ts: Date.now() })
    try {
      localStorage.setItem(`prayer_${key}`, JSON.stringify({ data, ts: Date.now() }))
    } catch { /* quota full */ }
    return data
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

export function clearCache(): void {
  cache.clear()
}

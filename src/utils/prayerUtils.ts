import dayjs from 'dayjs'

// ── API response shape ────────────────────────────────────────────────────────
// The e-Solat JAKIM API returns these exact field names:
// imsak | fajr | syuruk | dhuha | dhuhr | asr | maghrib | isha
// Dates are formatted as "10-May-2026"
// ─────────────────────────────────────────────────────────────────────────────

export interface PrayerSchedule {
  hijri: string   // e.g. "1447-11-22"
  date: string    // e.g. "10-May-2026"
  day: string     // e.g. "Sunday"
  imsak: string   // "05:30:00"
  fajr: string    // "05:40:00"
  syuruk: string  // "06:52:00"
  dhuha: string   // "07:19:00"
  dhuhr: string   // "13:01:00"
  asr: string     // "16:22:00"
  maghrib: string // "19:06:00"
  isha: string    // "20:19:00"
}

export const PRAYER_KEYS = ['imsak', 'fajr', 'syuruk', 'dhuha', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
export type PrayerKey = typeof PRAYER_KEYS[number]

export const PRAYER_META: Record<PrayerKey, {
  nameMs: string; nameEn: string; nameAr: string; icon: string; isCountable: boolean
}> = {
  imsak:   { nameMs: 'Imsak',   nameEn: 'Imsak',   nameAr: 'الإمساك', icon: '🌑', isCountable: true },
  fajr:    { nameMs: 'Subuh',   nameEn: 'Fajr',    nameAr: 'الفجر',   icon: '🌤', isCountable: true },
  syuruk:  { nameMs: 'Syuruk',  nameEn: 'Sunrise',  nameAr: 'الشروق',  icon: '🌅', isCountable: false },
  dhuha:   { nameMs: 'Dhuha',   nameEn: 'Dhuha',   nameAr: 'الضحى',   icon: '☀️', isCountable: false },
  dhuhr:   { nameMs: 'Zohor',   nameEn: 'Dhuhr',   nameAr: 'الظهر',   icon: '🌞', isCountable: true },
  asr:     { nameMs: 'Asar',    nameEn: 'Asr',     nameAr: 'العصر',   icon: '🌤', isCountable: true },
  maghrib: { nameMs: 'Maghrib', nameEn: 'Maghrib', nameAr: 'المغرب',  icon: '🌆', isCountable: true },
  isha:    { nameMs: 'Isyak',   nameEn: "Isha",    nameAr: 'العشاء',  icon: '🌙', isCountable: true },
}

export const COUNTABLE_PRAYERS: PrayerKey[] = PRAYER_KEYS.filter(k => PRAYER_META[k].isCountable)

export function parseTimeToday(timeStr: string): Date | null {
  if (!timeStr) return null
  const [h, m, s] = timeStr.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, s ?? 0, 0)
  return d
}

/** Parse the API date format "10-May-2026" → dayjs object.
 *  We parse manually because dayjs locale may be 'ms' (Malay)
 *  but the API always returns English month abbreviations. */
const EN_MONTHS: Record<string, number> = {
  Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,
  Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11,
}
export function parseApiDate(dateStr: string): ReturnType<typeof dayjs> {
  const parts = dateStr.split('-') // ["10","May","2026"]
  if (parts.length === 3) {
    const d = parseInt(parts[0])
    const m = EN_MONTHS[parts[1]]
    const y = parseInt(parts[2])
    if (!isNaN(d) && m !== undefined && !isNaN(y)) {
      return dayjs(new Date(y, m, d))
    }
  }
  return dayjs(dateStr) // fallback
}

export function findNextPrayer(
  schedule: PrayerSchedule | null,
  now: Date
): { key: PrayerKey; time: Date } | null {
  if (!schedule) return null
  for (const key of COUNTABLE_PRAYERS) {
    const t = parseTimeToday(schedule[key])
    if (t && t > now) return { key, time: t }
  }
  return null
}

export function findCurrentPrayer(
  schedule: PrayerSchedule | null,
  now: Date
): PrayerKey | null {
  if (!schedule) return null
  let current: PrayerKey | null = null
  for (const key of COUNTABLE_PRAYERS) {
    const t = parseTimeToday(schedule[key])
    if (t && t <= now) current = key
  }
  return current
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

export function getPrayerStatus(
  key: PrayerKey,
  schedule: PrayerSchedule | null,
  now: Date
): 'active' | 'passed' | 'upcoming' {
  if (!schedule) return 'upcoming'
  const current = findCurrentPrayer(schedule, now)
  const t = parseTimeToday(schedule[key])
  if (!t) return 'upcoming'
  if (key === current) return 'active'
  if (t < now) return 'passed'
  return 'upcoming'
}

export function formatTime12(time24: string): string {
  if (!time24) return '--:--'
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
}

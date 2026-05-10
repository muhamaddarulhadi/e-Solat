import dayjs from 'dayjs'

const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabiul Awal", "Rabiul Akhir",
  "Jamadil Awal", "Jamadil Akhir", 'Rejab', "Sha'ban",
  'Ramadan', 'Syawal', "Zulkaedah", 'Zulhijjah',
]

const HIJRI_MONTHS_AR = [
  'مُحَرَّم', 'صَفَر', 'رَبِيعُ الْأَوَّل', 'رَبِيعُ الْآخِر',
  'جُمَادَى الْأُولَى', 'جُمَادَى الْآخِرَة', 'رَجَب', 'شَعْبَان',
  'رَمَضَان', 'شَوَّال', 'ذُو الْقَعْدَة', 'ذُو الْحِجَّة',
]

export interface HijriDate {
  day: number
  month: number
  year: number
  monthName: string
  monthNameAr: string
  formatted: string
  formattedAr: string
}

/**
 * Convert Gregorian to Hijri using Umm al-Qura algorithm approximation.
 * For production, use a proper library or API.
 */
export function toHijri(date: Date = new Date()): HijriDate {
  // Use Intl API if available (best accuracy)
  try {
    const hijriFormatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    })
    const parts = hijriFormatter.formatToParts(date)
    const partMap: Record<string, string> = {}
    parts.forEach(p => { partMap[p.type] = p.value })

    const day   = parseInt(partMap.day   ?? '1')
    const month = parseInt(partMap.month ?? '1')
    const year  = parseInt(partMap.year  ?? '1446')

    return {
      day,
      month,
      year,
      monthName: HIJRI_MONTHS[month - 1] ?? '',
      monthNameAr: HIJRI_MONTHS_AR[month - 1] ?? '',
      formatted: `${day} ${HIJRI_MONTHS[month - 1]} ${year}H`,
      formattedAr: `${day} ${HIJRI_MONTHS_AR[month - 1]} ${year}هـ`,
    }
  } catch {
    // Fallback: simple approximation
    return fallbackHijri(date)
  }
}

function fallbackHijri(date: Date): HijriDate {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const { day, month, year } = jdToHijri(jd)
  return {
    day,
    month,
    year,
    monthName: HIJRI_MONTHS[month - 1] ?? '',
    monthNameAr: HIJRI_MONTHS_AR[month - 1] ?? '',
    formatted: `${day} ${HIJRI_MONTHS[month - 1]} ${year}H`,
    formattedAr: `${day} ${HIJRI_MONTHS_AR[month - 1]} ${year}هـ`,
  }
}

function gregorianToJD(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

function jdToHijri(jd: number): { day: number; month: number; year: number } {
  const l = jd - 1948440 + 10632
  const n = Math.floor((l - 1) / 10631)
  const l2 = l - 10631 * n + 354
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238)
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29
  const month = Math.floor((24 * l3) / 709)
  const day = l3 - Math.floor((709 * month) / 24)
  const year = 30 * n + j - 30
  return { day, month, year }
}

export function getTodayHijri(): HijriDate {
  return toHijri(new Date())
}

import { useMemo } from 'react'
import dayjs from 'dayjs'
import { toHijri } from '../utils/hijriDate'
import { useTheme } from '../hooks/useTheme'

interface HijriDateProps {
  date?: Date
  hijriFromApi?: string
  className?: string
}

const HIJRI_MONTHS = [
  'Muharram','Safar','Rabiul Awal','Rabiul Akhir',
  'Jamadil Awal','Jamadil Akhir','Rejab',"Sha'ban",
  'Ramadan','Syawal','Zulkaedah','Zulhijjah',
]

function parseApiHijri(hijri: string) {
  const [y, m, d] = hijri.split('-').map(Number)
  return { day: d, month: m, year: y, monthName: HIJRI_MONTHS[m - 1] ?? '' }
}

export function HijriDate({ date = new Date(), hijriFromApi, className = '' }: HijriDateProps) {
  const { isDark } = useTheme()

  const hijri = useMemo(() => {
    if (hijriFromApi) return parseApiHijri(hijriFromApi)
    const h = toHijri(date)
    return { day: h.day, month: h.month, year: h.year, monthName: h.monthName }
  }, [date, hijriFromApi])

  return (
    <div className={`text-right ${className}`}>
      <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {dayjs(date).format('D MMM YYYY')}
      </p>
      <p className="text-xs font-bold mt-0.5" style={{ color: '#10b981' }}>
        {hijri.day} {hijri.monthName} {hijri.year}H
      </p>
    </div>
  )
}

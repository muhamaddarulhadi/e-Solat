import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { PrayerTable, PrayerTableSkeleton } from '../components/PrayerTable'
import { getZoneState, getZoneDaerah } from '../utils/zones'
import dayjs from 'dayjs'

interface MonthlyPageProps {
  zone: string
}

export function MonthlyPage({ zone }: MonthlyPageProps) {
  const { isDark } = useTheme()
  const { data, loading, error, refetch } = usePrayerTimes(zone, 'month')
  const [downloading, setDownloading] = useState(false)

  const monthName = dayjs().format('MMMM YYYY')

  const downloadCSV = () => {
    if (!data.length) return
    setDownloading(true)
    const headers = ['Tarikh', 'Hari', 'Imsak', 'Subuh/Fajr', 'Syuruk', 'Dhuha', 'Zohor/Dhuhr', 'Asar', 'Maghrib', 'Isyak/Isha']
    const rows = data.map(r => [
      r.date, r.day, r.imsak, r.fajr, r.syuruk, r.dhuha, r.dhuhr, r.asr, r.maghrib, r.isha
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `waktu-solat-${zone}-${dayjs().format('YYYY-MM')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setTimeout(() => setDownloading(false), 1000)
  }

  return (
    <div className="page-enter space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Jadual Bulanan
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {monthName}
          </p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="font-semibold">{zone}</span> · {getZoneState(zone)} · {getZoneDaerah(zone)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            disabled={loading || !data.length || downloading}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all
              ${isDark
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30 disabled:opacity-40'
                : 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 disabled:opacity-40'
              }
            `}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {downloading ? 'Memuat...' : 'CSV'}
          </button>
          <button
            onClick={refetch}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={refetch} className="mt-2 text-xs text-red-300 underline">Cuba lagi</button>
        </div>
      )}

      {loading ? (
        <PrayerTableSkeleton />
      ) : (
        <PrayerTable data={data} storageKey="visible_prayers_monthly" />
      )}

      {data.length > 0 && (
        <div className={`text-center p-4 rounded-2xl ${isDark ? 'bg-white/5 border border-white/8' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {data.length} hari dipaparkan
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {zone} · {getZoneState(zone)} · {getZoneDaerah(zone)} | Sumber: e-Solat JAKIM
          </p>
        </div>
      )}
    </div>
  )
}

import { useTheme } from '../hooks/useTheme'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { PrayerTable, PrayerTableSkeleton } from '../components/PrayerTable'
import { parseApiDate } from '../utils/prayerUtils'
import { getZoneState, getZoneDaerah } from '../utils/zones'

interface WeeklyPageProps {
  zone: string
  use24h: boolean
}

export function WeeklyPage({ zone, use24h }: WeeklyPageProps) {
  const { isDark } = useTheme()
  const { data, loading, error, refetch } = usePrayerTimes(zone, 'week')

  const weekRange = data.length
    ? `${parseApiDate(data[0].date).format('D MMM')} – ${parseApiDate(data[data.length - 1].date).format('D MMM YYYY')}`
    : ''

  return (
    <div className="page-enter space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Jadual Mingguan
          </h1>
          {weekRange && (
            <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {weekRange}
            </p>
          )}
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="font-semibold">{zone}</span> · {getZoneState(zone)} · {getZoneDaerah(zone)}
          </p>
        </div>
        <button
          onClick={refetch}
          className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
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
        <PrayerTable data={data} use24h={use24h} />
      )}
    </div>
  )
}

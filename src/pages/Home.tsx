import { useTheme } from '../hooks/useTheme'
import { useCountdown } from '../hooks/useCountdown'
import { CountdownTimer } from '../components/CountdownTimer'
import { PrayerCard, PrayerCardSkeleton } from '../components/PrayerCard'
import { ZoneSelector } from '../components/ZoneSelector'
import { HijriDate } from '../components/HijriDate'
import { PRAYER_KEYS, getPrayerStatus, type PrayerKey } from '../utils/prayerUtils'
import type { PrayerSchedule } from '../utils/prayerUtils'
import { getZoneState } from '../utils/zones'

interface HomePageProps {
  zone: string
  onZoneChange: (z: string) => void
  today: PrayerSchedule | null
  loading: boolean
  error: string | null
  onRefetch: () => void
  visiblePrayers: PrayerKey[]
  favoriteZones: string[]
  onToggleFavorite: (z: string) => void
}

export function HomePage({
  zone, onZoneChange, today, loading, error, onRefetch,
  visiblePrayers, favoriteZones, onToggleFavorite,
}: HomePageProps) {
  const { isDark } = useTheme()
  const countdown = useCountdown(today)
  const isFav = favoriteZones.includes(zone)

  return (
    <div className="page-enter space-y-3">

      {/* Zone + Date card */}
      <div className={`rounded-3xl p-4 border ${
        isDark
          ? 'bg-white/[0.03] border-white/[0.07]'
          : 'bg-white border-black/[0.06] shadow-sm'
      }`}>
        {/* Top row: zone name + hijri */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Lokasi Anda
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {getZoneState(zone) || 'Pilih Zon'}
              </p>
              <button onClick={() => onToggleFavorite(zone)}
                className="transition-colors"
                style={{ color: isFav ? '#f59e0b' : isDark ? '#374151' : '#d1d5db' }}
              >
                <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </button>
            </div>
          </div>
          <HijriDate hijriFromApi={today?.hijri} />
        </div>

        <ZoneSelector value={zone} onChange={onZoneChange} />

        {/* Favorite zone chips */}
        {favoriteZones.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-0.5">
            {favoriteZones.map(fz => (
              <button key={fz} onClick={() => onZoneChange(fz)}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  fz === zone
                    ? ''
                    : isDark ? 'bg-white/6 text-slate-400 border border-white/8 hover:bg-white/10' : 'bg-slate-100 text-slate-500 border border-black/6 hover:bg-slate-200'
                }`}
                style={fz === zone ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' } : {}}
              >
                ⭐ {fz}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Countdown */}
      <CountdownTimer
        nextPrayer={countdown.nextPrayer}
        nextPrayerTime={countdown.nextPrayerTime}
        currentPrayer={countdown.currentPrayer}
        countdown={countdown.countdown}
        now={countdown.now}
      />

      {/* Prayer list */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Waktu Solat Hari Ini
          </p>
          <button onClick={onRefetch}
            className={`p-1.5 rounded-xl transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-white/8' : 'text-slate-400 hover:text-slate-600 hover:bg-black/6'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-3 p-4 rounded-2xl"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={onRefetch} className="mt-1.5 text-xs text-red-400 underline">Cuba lagi</button>
          </div>
        )}

        <div className="space-y-2" role="list">
          {loading
            ? Array.from({ length: visiblePrayers.length || 8 }).map((_, i) => <PrayerCardSkeleton key={i} />)
            : PRAYER_KEYS.filter(k => visiblePrayers.includes(k)).map(key => (
                <PrayerCard
                  key={key}
                  prayerKey={key}
                  schedule={today}
                  status={getPrayerStatus(key, today, countdown.now)}
                />
              ))
          }
        </div>
      </div>

      <p className={`text-xs text-center py-2 ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
        Sumber: e-Solat JAKIM Malaysia
      </p>
    </div>
  )
}

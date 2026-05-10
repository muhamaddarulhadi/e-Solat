import { useTheme } from '../hooks/useTheme'
import { PRAYER_META, formatTime12, type PrayerKey } from '../utils/prayerUtils'
import dayjs from 'dayjs'

interface CountdownTimerProps {
  nextPrayer: PrayerKey | null
  nextPrayerTime: Date | null
  currentPrayer: PrayerKey | null
  countdown: string
  now: Date
  use24h: boolean
}

export function CountdownTimer({ nextPrayer, nextPrayerTime, currentPrayer, countdown, now, use24h }: CountdownTimerProps) {
  const { isDark } = useTheme()
  const [hh, mm, ss] = countdown.split(':')

  return (
    <div className="relative overflow-hidden rounded-3xl p-6"
      style={isDark
        ? { background: 'linear-gradient(135deg, #0a2218 0%, #071a11 50%, #050f0a 100%)', border: '1px solid rgba(16,185,129,0.15)' }
        : { background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)', border: '1px solid rgba(16,185,129,0.25)' }
      }
    >
      {/* Decorative blur orb */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)' }}
      />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full blur-2xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.1), transparent 70%)' }}
      />

      <div className="relative z-10">
        {/* Live clock */}
        <div className="text-center mb-5">
          <div className="flex items-baseline justify-center">
            <span className={`text-6xl font-bold tracking-tight tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}
              style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
            >
              {dayjs(now).format('HH:mm')}
            </span>
            <span className={`text-2xl font-medium ml-0.5 ${isDark ? 'text-emerald-500/70' : 'text-emerald-600/70'}`}>
              {dayjs(now).format(':ss')}
            </span>
          </div>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {dayjs(now).format('dddd, D MMMM YYYY')}
          </p>
        </div>

        {/* Divider */}
        <div className={`h-px mx-4 mb-5 ${isDark ? 'bg-white/8' : 'bg-black/8'}`} />

        {/* Next prayer */}
        {nextPrayer ? (
          <div className="text-center">
            <p className={`text-xs font-semibold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-emerald-500' : 'text-emerald-700'}`}>
              Solat Seterusnya
            </p>

            <div className="flex items-center justify-center gap-2.5 mb-1">
              <span className="text-3xl">{PRAYER_META[nextPrayer].icon}</span>
              <div className="text-left">
                <p className={`text-2xl font-bold leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {PRAYER_META[nextPrayer].nameMs}
                </p>
                <p className={`text-lg font-semibold mt-0.5 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  {nextPrayerTime
                    ? use24h
                      ? dayjs(nextPrayerTime).format('HH:mm')
                      : formatTime12(dayjs(nextPrayerTime).format('HH:mm:ss'))
                    : ''}
                </p>
              </div>
            </div>

            {/* Countdown blocks */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[hh, mm, ss].map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-16 py-2.5 rounded-2xl text-center ${
                    isDark
                      ? 'bg-black/30 border border-white/8'
                      : 'bg-white/60 border border-black/8 shadow-sm'
                  }`}>
                    <p className={`text-2xl font-bold tabular-nums ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {val}
                    </p>
                    <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {['jam', 'min', 'saat'][i]}
                    </p>
                  </div>
                  {i < 2 && (
                    <span className={`text-xl font-bold ${isDark ? 'text-emerald-600' : 'text-emerald-400'}`}>:</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className={`text-base font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Semua solat hari ini telah berlalu
            </p>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Semoga diterima ibadah anda 🤲
            </p>
          </div>
        )}

        {/* Current prayer pill */}
        {currentPrayer && (
          <div className="flex justify-center mt-4">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sekarang: {PRAYER_META[currentPrayer].nameMs}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

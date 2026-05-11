import { useTheme } from '../hooks/useTheme'
import { PRAYER_META, formatTime12, type PrayerKey, type PrayerSchedule } from '../utils/prayerUtils'

interface PrayerCardProps {
  prayerKey: PrayerKey
  schedule: PrayerSchedule | null
  status: 'active' | 'passed' | 'upcoming'
}

export function PrayerCard({ prayerKey, schedule, status }: PrayerCardProps) {
  const { isDark } = useTheme()
  const meta = PRAYER_META[prayerKey]
  const timeStr = schedule?.[prayerKey] ?? '--:--'
  const displayTime = formatTime12(timeStr)
  const isActive = status === 'active'
  const isPassed = status === 'passed'

  return (
    <div
      className={`
        flex items-center justify-between px-4 py-3.5 rounded-2xl border
        transition-all duration-300
        ${isActive ? 'glow-pulse prayer-active-row' : ''}
        ${!isActive ? (isDark
          ? 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06]'
          : 'bg-white border-black/[0.06] hover:border-emerald-200 shadow-sm'
        ) : ''}
        ${isPassed ? 'opacity-45' : ''}
      `}
      role="listitem"
    >
      {/* Left: icon + name */}
      <div className="flex items-center gap-3.5">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 transition-all
          ${isActive
            ? isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
            : isDark ? 'bg-white/[0.06]' : 'bg-slate-50'
          }
        `}>
          {meta.icon}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {meta.nameMs}
            </p>
            {isActive && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                Sekarang
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 arabic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {meta.nameAr}
          </p>
        </div>
      </div>

      {/* Right: time */}
      <div className="text-right">
        <p className={`font-bold text-base tabular-nums ${
          isActive
            ? isDark ? 'text-emerald-300' : 'text-emerald-700'
            : isPassed
              ? isDark ? 'text-slate-600' : 'text-slate-400'
              : isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {displayTime}
        </p>
        {isPassed && (
          <p className={`text-[10px] font-medium ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
            Selesai
          </p>
        )}
      </div>
    </div>
  )
}

export function PrayerCardSkeleton() {
  const { isDark } = useTheme()
  return (
    <div className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border animate-pulse
      ${isDark ? 'bg-white/[0.03] border-white/[0.07]' : 'bg-white border-black/[0.06]'}
    `}>
      <div className="flex items-center gap-3.5">
        <div className={`w-11 h-11 rounded-2xl ${isDark ? 'bg-white/8' : 'bg-slate-100'}`} />
        <div>
          <div className={`h-3.5 w-14 rounded-lg mb-2 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className={`h-3 w-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
        </div>
      </div>
      <div className={`h-5 w-16 rounded-lg ${isDark ? 'bg-white/8' : 'bg-slate-200'}`} />
    </div>
  )
}

import { useTheme } from '../hooks/useTheme'
import type { PrayerSchedule } from '../utils/prayerUtils'
import { PRAYER_META, PRAYER_KEYS, parseApiDate, formatTime12 } from '../utils/prayerUtils'
import dayjs from 'dayjs'

interface PrayerTableProps {
  data: PrayerSchedule[]
  use24h?: boolean
}

export function PrayerTable({ data, use24h = false }: PrayerTableProps) {
  const { isDark } = useTheme()
  if (!data.length) return null

  const todayStr = dayjs().format('DD-MMM-YYYY') // matches API format e.g. "10-May-2026"

  // colours
  const borderCol  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const headerBg   = isDark ? '#0d1f17' : '#f0fdf4'
  const headerText = isDark ? '#6ee7b7' : '#065f46'
  const bodyBg     = isDark ? '#060d0a' : '#ffffff'
  const rowHover   = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
  const todayBg    = isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.07)'
  const todayBor   = '#10b981'
  const stickyBg   = isDark ? '#060d0a' : '#ffffff'
  const stickyTodayBg = isDark ? '#071a10' : '#f0fdf4'
  const textMain   = isDark ? '#e8f5ee' : '#0d2018'
  const textMuted  = isDark ? '#4b7a5e' : '#9ca3af'

  return (
    <div style={{ borderRadius: '1.25rem', border: `1px solid ${borderCol}`, overflow: 'hidden' }}>
      <div className="table-scroll" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 660, borderCollapse: 'collapse', fontSize: 13 }}>

          {/* ── Header ─────────────────────────────────────────────── */}
          <thead>
            <tr style={{ background: headerBg }}>
              {/* Sticky date column header */}
              <th style={{
                position: 'sticky', left: 0, zIndex: 30,
                background: headerBg,
                padding: '10px 12px',
                textAlign: 'left',
                fontWeight: 700,
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: headerText,
                borderRight: `1px solid ${borderCol}`,
                borderBottom: `1px solid ${borderCol}`,
                whiteSpace: 'nowrap',
              }}>
                Tarikh
              </th>
              {PRAYER_KEYS.map((key, i) => (
                <th key={key} style={{
                  padding: '10px 8px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: headerText,
                  whiteSpace: 'nowrap',
                  borderBottom: `1px solid ${borderCol}`,
                  borderRight: i < PRAYER_KEYS.length - 1 ? `1px solid ${borderCol}` : undefined,
                }}>
                  <span style={{ marginRight: 3 }}>{PRAYER_META[key].icon}</span>
                  {PRAYER_META[key].nameMs}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ───────────────────────────────────────────────── */}
          <tbody>
            {data.map((row, i) => {
              const isToday = row.date === todayStr
              const parsed  = parseApiDate(row.date)
              const isLast  = i === data.length - 1

              return (
                <tr key={row.date ?? i}
                  style={{
                    background: isToday ? todayBg : bodyBg,
                    borderLeft: isToday ? `3px solid ${todayBor}` : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isToday) (e.currentTarget as HTMLElement).style.background = rowHover }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isToday ? todayBg : bodyBg }}
                >
                  {/* Sticky date cell */}
                  <td style={{
                    position: 'sticky', left: 0, zIndex: 10,
                    background: isToday ? stickyTodayBg : stickyBg,
                    padding: '10px 12px',
                    borderRight: `1px solid ${borderCol}`,
                    borderBottom: isLast ? undefined : `1px solid ${borderCol}`,
                    whiteSpace: 'nowrap',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isToday && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0, display: 'inline-block' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: isToday ? '#10b981' : textMain }}>
                          {parsed.isValid() ? parsed.format('D MMM') : row.date}
                        </div>
                        <div style={{ fontSize: 10, color: textMuted, marginTop: 1 }}>
                          {parsed.isValid() ? parsed.format('ddd') : row.day}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Prayer time cells */}
                  {PRAYER_KEYS.map((key, j) => (
                    <td key={key} style={{
                      padding: '10px 8px',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: isToday ? 700 : 400,
                      color: isToday ? '#34d399' : textMain,
                      borderBottom: isLast ? undefined : `1px solid ${borderCol}`,
                      borderRight: j < PRAYER_KEYS.length - 1 ? `1px solid ${borderCol}` : undefined,
                    }}>
                      {row[key]
                        ? use24h
                          ? row[key].slice(0, 5)
                          : formatTime12(row[key])
                        : '--:--'
                      }
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 12px',
        textAlign: 'right',
        fontSize: 10,
        color: textMuted,
        borderTop: `1px solid ${borderCol}`,
        background: headerBg,
      }}>
        Sumber: e-Solat JAKIM · {data.length} hari
      </div>
    </div>
  )
}

export function PrayerTableSkeleton() {
  const { isDark } = useTheme()
  const bg = isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'
  return (
    <div style={{ borderRadius: '1.25rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          display: 'flex', gap: 8, padding: '12px',
          borderBottom: i < 7 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` : undefined,
          background: isDark ? '#060d0a' : '#fff',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          <div style={{ width: 52, height: 34, borderRadius: 8, background: bg, flexShrink: 0 }} />
          {Array.from({ length: 8 }).map((_, j) => (
            <div key={j} style={{ flex: 1, height: 34, borderRadius: 8, background: bg }} />
          ))}
        </div>
      ))}
    </div>
  )
}

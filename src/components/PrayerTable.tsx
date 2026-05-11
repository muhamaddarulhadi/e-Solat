import { useState, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'
import type { PrayerSchedule, PrayerKey } from '../utils/prayerUtils'
import { PRAYER_META, PRAYER_KEYS, parseApiDate, formatTime12 } from '../utils/prayerUtils'
import dayjs from 'dayjs'

interface PrayerTableProps {
  data: PrayerSchedule[]
  storageKey: string
}

export function PrayerTable({ data, storageKey }: PrayerTableProps) {
  const { isDark } = useTheme()

  // Load from localStorage, default to all visible
  const [visibleCols, setVisibleCols] = useState<Set<PrayerKey>>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as PrayerKey[]
        if (Array.isArray(parsed) && parsed.length > 0) return new Set(parsed)
      }
    } catch { /* ignore */ }
    return new Set(PRAYER_KEYS)
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)

  if (!data.length) return null

  const todayStr = dayjs().format('DD-MMM-YYYY')

  const toggleCol = (key: PrayerKey) => {
    setVisibleCols(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size === 1) return prev // keep at least 1
        next.delete(key)
      } else {
        next.add(key)
      }
      try { localStorage.setItem(storageKey, JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }

  const activeCols = PRAYER_KEYS.filter(k => visibleCols.has(k))

  // Drag-to-scroll
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    dragStartX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    dragScrollLeft.current = scrollRef.current?.scrollLeft ?? 0
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    if (scrollRef.current) scrollRef.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current)
  }
  const onMouseUp = () => {
    dragging.current = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  // colours
  const borderCol     = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const headerBg      = isDark ? '#0d1f17' : '#f0fdf4'
  const headerText    = isDark ? '#6ee7b7' : '#065f46'
  const bodyBg        = isDark ? '#060d0a' : '#ffffff'
  const rowHover      = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
  const todayBg       = isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.07)'
  const todayBor      = '#10b981'
  const stickyBg      = isDark ? '#060d0a' : '#ffffff'
  const stickyTodayBg = isDark ? '#071a10' : '#f0fdf4'
  const textMain      = isDark ? '#e8f5ee' : '#0d2018'
  const textMuted     = isDark ? '#4b7a5e' : '#9ca3af'

  return (
    <div className="space-y-3">

      {/* ── Column toggle pills ─────────────────────────────────── */}
      <div style={{
        borderRadius: '1rem',
        border: `1px solid ${borderCol}`,
        background: isDark ? '#0a1a12' : '#f8fffe',
        padding: '12px 14px',
      }}>
        <p style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: isDark ? '#4b7a5e' : '#6b9e88',
          marginBottom: 10,
        }}>
          Tunjuk / Sembunyi Waktu Solat
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PRAYER_KEYS.map(key => {
            const active = visibleCols.has(key)
            return (
              <button
                key={key}
                onClick={() => toggleCol(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: active
                    ? '1.5px solid rgba(16,185,129,0.5)'
                    : `1.5px solid ${borderCol}`,
                  background: active
                    ? isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)'
                    : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  color: active
                    ? isDark ? '#6ee7b7' : '#065f46'
                    : isDark ? '#4b5563' : '#9ca3af',
                }}
              >
                {/* Checkbox indicator */}
                <span style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  border: `2px solid ${active ? '#10b981' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                  background: active ? '#10b981' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}>
                  {active && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span>{PRAYER_META[key].icon}</span>
                <span>{PRAYER_META[key].nameMs}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div style={{ borderRadius: '1.25rem', border: `1px solid ${borderCol}`, overflow: 'hidden' }}>
        <div
          ref={scrollRef}
          className="table-scroll"
          style={{ overflowX: 'auto', cursor: 'grab', userSelect: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>

            {/* ── Header ───────────────────────────────────────── */}
            <thead>
              <tr style={{ background: headerBg }}>
                {/* Sticky date column */}
                <th style={{
                  position: 'sticky', left: 0, zIndex: 30,
                  background: headerBg,
                  padding: '10px 14px',
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

                {activeCols.map((key, i) => (
                  <th key={key} style={{
                    padding: '10px 14px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: headerText,
                    whiteSpace: 'nowrap',
                    borderBottom: `1px solid ${borderCol}`,
                    borderRight: i < activeCols.length - 1 ? `1px solid ${borderCol}` : undefined,
                  }}>
                    <span style={{ marginRight: 3 }}>{PRAYER_META[key].icon}</span>
                    {PRAYER_META[key].nameMs}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ─────────────────────────────────────────── */}
            <tbody>
              {data.map((row, i) => {
                const isToday = row.date === todayStr
                const parsed  = parseApiDate(row.date)
                const isLast  = i === data.length - 1

                return (
                  <tr
                    key={row.date ?? i}
                    style={{
                      background: isToday ? todayBg : bodyBg,
                      borderLeft: isToday ? `3px solid ${todayBor}` : '3px solid transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isToday) (e.currentTarget as HTMLElement).style.background = rowHover
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = isToday ? todayBg : bodyBg
                    }}
                  >
                    {/* Sticky date cell */}
                    <td style={{
                      position: 'sticky', left: 0, zIndex: 10,
                      background: isToday ? stickyTodayBg : stickyBg,
                      padding: '10px 14px',
                      borderRight: `1px solid ${borderCol}`,
                      borderBottom: isLast ? undefined : `1px solid ${borderCol}`,
                      whiteSpace: 'nowrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isToday && (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
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

                    {/* Prayer time cells — only visible columns */}
                    {activeCols.map((key, j) => (
                      <td key={key} style={{
                        padding: '10px 14px',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: 12,
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? '#34d399' : textMain,
                        borderBottom: isLast ? undefined : `1px solid ${borderCol}`,
                        borderRight: j < activeCols.length - 1 ? `1px solid ${borderCol}` : undefined,
                      }}>
                        {row[key] ? formatTime12(row[key]) : '--:--'}
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
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 10,
          color: textMuted,
          borderTop: `1px solid ${borderCol}`,
          background: headerBg,
        }}>
          <span style={{ color: isDark ? '#4b7a5e' : '#9ca3af' }}>
            {activeCols.length} / {PRAYER_KEYS.length} waktu dipapar
          </span>
          <span>Sumber: e-Solat JAKIM · {data.length} hari</span>
        </div>
      </div>
    </div>
  )
}

export function PrayerTableSkeleton() {
  const { isDark } = useTheme()
  const bg = isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'
  return (
    <div className="space-y-3">
      {/* Skeleton for column toggles */}
      <div style={{
        borderRadius: '1rem',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        background: isDark ? '#0a1a12' : '#f8fffe',
        padding: '12px 14px',
      }}>
        <div style={{ width: 160, height: 10, borderRadius: 6, background: bg, marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ width: 80, height: 30, borderRadius: 999, background: bg }} />
          ))}
        </div>
      </div>

      {/* Skeleton for table */}
      <div style={{ borderRadius: '1.25rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, overflow: 'hidden' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            display: 'flex', gap: 8, padding: '12px',
            borderBottom: i < 7 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` : undefined,
            background: isDark ? '#060d0a' : '#fff',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            <div style={{ width: 64, height: 34, borderRadius: 8, background: bg, flexShrink: 0 }} />
            {Array.from({ length: 8 }).map((_, j) => (
              <div key={j} style={{ flex: 1, height: 34, borderRadius: 8, background: bg }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

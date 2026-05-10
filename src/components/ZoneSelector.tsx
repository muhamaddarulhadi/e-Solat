import { useState, useRef, useEffect } from 'react'
import { ZONE_GROUPS, ALL_ZONES, getZoneState, getZoneDaerah } from '../utils/zones'
import { useTheme } from '../hooks/useTheme'

interface ZoneSelectorProps {
  value: string
  onChange: (zone: string) => void
  className?: string
}

export function ZoneSelector({ value, onChange, className = '' }: ZoneSelectorProps) {
  const { isDark } = useTheme()
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const searchRef   = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const q = search.trim().toLowerCase()
  const filtered = q
    ? ALL_ZONES.filter(z =>
        z.state.toLowerCase().includes(q) ||   // e.g. "selangor", "johor"
        z.label.toLowerCase().includes(q) ||    // district names
        z.value.toLowerCase().includes(q)       // e.g. "sgr01"
      )
    : null

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60)
    else setSearch('')
  }, [open])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (z: string) => { onChange(z); setOpen(false) }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
          open
            ? isDark
              ? 'bg-white/8 border-emerald-500/40'
              : 'bg-white border-emerald-400 shadow-md shadow-emerald-500/10'
            : isDark
              ? 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07]'
              : 'bg-white border-black/[0.08] hover:border-emerald-300 shadow-sm'
        }`}
        aria-haspopup="listbox" aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
          >
            {value ? value.slice(0, 3) : '📍'}
          </div>
          <div className="text-left min-w-0">
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {value ? getZoneState(value) : 'Zon Waktu Solat'}
            </p>
            <p className={`text-sm font-bold truncate mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {value ? getZoneDaerah(value) : 'Pilih Zon Anda'}
            </p>
          </div>
        </div>
        <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isDark ? 'text-slate-400' : 'text-slate-400'} ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl z-50 overflow-hidden"
          style={{
            maxHeight: '68vh',
            background: isDark ? '#0d1f17' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark
              ? '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.1)'
              : '0 24px 64px rgba(0,0,0,0.15)',
          }}
        >
          {/* Search bar */}
          <div className={`p-3 border-b ${isDark ? 'border-white/8' : 'border-black/6'}`}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input ref={searchRef} type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari negeri, zon, daerah..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                  isDark
                    ? 'bg-white/8 border border-white/10 text-white placeholder-slate-500 focus:border-emerald-500/50'
                    : 'bg-slate-50 border border-black/8 text-slate-900 placeholder-slate-400 focus:border-emerald-400'
                }`}
              />
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(68vh - 68px)' }} role="listbox">
            {filtered ? (
              filtered.length === 0
                ? <p className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tiada zon dijumpai</p>
                : filtered.map(z => (
                    <ZoneOpt key={z.value} zone={z.value} label={z.label} selected={value === z.value} onSelect={select} isDark={isDark} />
                  ))
            ) : (
              ZONE_GROUPS.map(g => (
                <div key={g.state}>
                  <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] sticky top-0 ${
                    isDark ? 'bg-[#0d1f17] text-emerald-500' : 'bg-slate-50/90 text-emerald-700'
                  }`}>
                    {g.state}
                  </div>
                  {g.zones.map(z => (
                    <ZoneOpt key={z.value} zone={z.value} label={z.label} selected={value === z.value} onSelect={select} isDark={isDark} />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ZoneOpt({ zone, label, selected, onSelect, isDark }: {
  zone: string; label: string; selected: boolean; onSelect: (z: string) => void; isDark: boolean
}) {
  const daerah = label.split(' - ')[1] ?? label
  return (
    <button onClick={() => onSelect(zone)} role="option" aria-selected={selected}
      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
        selected
          ? isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'
          : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${
          selected
            ? isDark ? 'text-emerald-300 font-semibold' : 'text-emerald-800 font-semibold'
            : isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>{daerah}</p>
      </div>
      {selected && (
        <svg className="w-4 h-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
        </svg>
      )}
    </button>
  )
}

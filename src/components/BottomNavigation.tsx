import { useTheme } from '../hooks/useTheme'

export type NavPage = 'home' | 'weekly' | 'monthly'

interface NavItem { id: NavPage; label: string; icon: (a: boolean) => JSX.Element }

const ITEMS: NavItem[] = [
  {
    id: 'home', label: 'Hari Ini',
    icon: a => (
      <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={a ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    id: 'weekly', label: 'Mingguan',
    icon: a => (
      <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={a ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    id: 'monthly', label: 'Bulanan',
    icon: a => (
      <svg className="w-5 h-5" fill={a ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={a ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
      </svg>
    ),
  },
]

export function BottomNavigation({ active, onChange }: { active: NavPage; onChange: (p: NavPage) => void }) {
  const { isDark } = useTheme()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: isDark ? 'rgba(6,13,10,0.94)' : 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(24px)',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch px-4 py-1.5 max-w-lg mx-auto">
        {ITEMS.map(item => {
          const isActive = item.id === active
          return (
            <button key={item.id} onClick={() => onChange(item.id)}
              className="nav-item"
              style={isActive ? { color: '#10b981' } : {}}
              aria-label={item.label}
            >
              {item.icon(isActive)}
              <span className="text-[11px] font-semibold" style={{ color: isActive ? '#10b981' : isDark ? '#6b7280' : '#9ca3af' }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

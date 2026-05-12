import { useTheme } from '../hooks/useTheme'

interface HeaderProps {
  onSettingsOpen: () => void
}

export function Header({ onSettingsOpen }: HeaderProps) {
  const { isDark, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className={`
        px-5 py-3.5 flex items-center justify-between
        ${isDark
          ? 'bg-[#0f0f11]/80 backdrop-blur-2xl border-b border-white/6'
          : 'bg-white/80 backdrop-blur-2xl border-b border-black/6 shadow-sm'
        }
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg,#10b981,#047857)' }}>
            <span className="text-white text-base">☪</span>
          </div>
          <div>
            <p className={`font-bold text-sm leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Waktu Solat
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#10b981' }}>Malaysia</p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <IconBtn onClick={toggle} label="Tukar tema" isDark={isDark}>
            {isDark
              ? <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="5"/><path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              : <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            }
          </IconBtn>

          <IconBtn onClick={onSettingsOpen} label="Tetapan" isDark={isDark}>
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </IconBtn>
        </div>
      </div>
    </header>
  )
}

function IconBtn({ children, onClick, label, isDark }: {
  children: React.ReactNode; onClick: () => void; label: string; isDark: boolean
}) {
  return (
    <button onClick={onClick} aria-label={label}
      className={`p-2 rounded-xl transition-all duration-200
        ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-black/6'}
      `}
    >
      {children}
    </button>
  )
}

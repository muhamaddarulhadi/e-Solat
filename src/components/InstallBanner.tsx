import { useTheme } from '../hooks/useTheme'

interface InstallBannerProps {
  onInstall: () => void
  onDismiss: () => void
}

export function InstallBanner({ onInstall, onDismiss }: InstallBannerProps) {
  const { isDark } = useTheme()

  return (
    <div
      className="fixed left-0 right-0 z-50 flex justify-center px-4"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom) + 8px)' }}
    >
      <div
        className={`w-full max-w-lg flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl ${
          isDark
            ? 'bg-[#1c1c21] border border-white/10'
            : 'bg-white border border-black/8'
        }`}
        style={{ boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.15)' }}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#10b981,#047857)' }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Pasang Aplikasi
          </p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Akses pantas dari skrin utama
          </p>
        </div>

        {/* Install button */}
        <button
          onClick={onInstall}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 active:opacity-75"
          style={{ background: 'linear-gradient(135deg,#10b981,#047857)' }}
        >
          Pasang
        </button>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          aria-label="Tutup"
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
            isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-white/8' : 'text-slate-400 hover:text-slate-600 hover:bg-black/6'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

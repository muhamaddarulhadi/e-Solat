import { useTheme } from '../hooks/useTheme'
import { QiblaCompass } from '../components/QiblaCompass'

export function QiblaPage() {
  const { isDark } = useTheme()

  return (
    <div className="page-enter">
      <div className={`rounded-3xl p-6 ${isDark ? 'bg-white/5 border border-white/8' : 'bg-white border border-slate-200 shadow-sm'}`}>
        <QiblaCompass />
      </div>

      <div className={`mt-4 rounded-2xl p-4 ${isDark ? 'bg-primary-900/30 border border-primary-800/40' : 'bg-primary-50 border border-primary-100'}`}>
        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-primary-300' : 'text-primary-700'}`}>
          🕌 Cara Penggunaan
        </p>
        <ul className={`text-xs space-y-1.5 list-disc list-inside ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <li>Tekan butang "Kesan Lokasi Saya" untuk mendapatkan arah kiblat</li>
          <li>Pastikan GPS dan kompas peranti diaktifkan</li>
          <li>Jarum hijau menunjukkan arah Kaabah</li>
          <li>Kalibrasi kompas dengan menggerakkan peranti dalam corak angka 8</li>
        </ul>
      </div>
    </div>
  )
}

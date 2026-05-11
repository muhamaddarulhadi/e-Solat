import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { InstallBanner } from './components/InstallBanner'
import { BottomNavigation, type NavPage } from './components/BottomNavigation'
import { SettingsModal } from './components/SettingsModal'
import { HomePage } from './pages/Home'
import { WeeklyPage } from './pages/Weekly'
import { MonthlyPage } from './pages/Monthly'
import { useTodayPrayer } from './hooks/usePrayerTimes'
import { useNotifications } from './hooks/useNotifications'
import { useAzan } from './hooks/useAzan'
import { DEFAULT_ZONE } from './utils/zones'
import { PRAYER_KEYS, type PrayerKey } from './utils/prayerUtils'

const STORAGE_KEYS = {
  zone:          'selected_zone',
  azan:          'azan_enabled',
  favs:          'favorite_zones',
  visibleDaily:  'visible_prayers_daily',
}

function loadPref<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    if (v === null) return fallback
    return JSON.parse(v) as T
  } catch { return fallback }
}

export default function App() {
  const [zone, setZone]               = useState<string>(() => loadPref(STORAGE_KEYS.zone, DEFAULT_ZONE))
  const [page, setPage]               = useState<NavPage>('home')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [azanEnabled, setAzanEnabled] = useState<boolean>(() => loadPref(STORAGE_KEYS.azan, true))
  const [favoriteZones, setFavoriteZones] = useState<string[]>(() => loadPref(STORAGE_KEYS.favs, []))
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [canInstall, setCanInstall]   = useState(false)

  // Which prayers are visible on the home (daily) page — all by default
  const [visiblePrayersDaily, setVisiblePrayersDaily] = useState<PrayerKey[]>(
    () => loadPref<PrayerKey[]>(STORAGE_KEYS.visibleDaily, [...PRAYER_KEYS])
  )

  const { today, loading, error, refetch } = useTodayPrayer(zone)
  const { settings: notifSettings, saveSettings: saveNotifSettings, permission, toggleEnabled } = useNotifications(today)

  useAzan(today, azanEnabled)

  // Capture PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
      setCanInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Persist zone
  const handleZoneChange = useCallback((z: string) => {
    setZone(z)
    localStorage.setItem(STORAGE_KEYS.zone, JSON.stringify(z))
  }, [])

  // Persist azan
  const toggleAzan = () => {
    setAzanEnabled(v => {
      localStorage.setItem(STORAGE_KEYS.azan, JSON.stringify(!v))
      return !v
    })
  }

  // Persist visible daily prayers
  const saveVisiblePrayersDaily = (keys: PrayerKey[]) => {
    setVisiblePrayersDaily(keys)
    localStorage.setItem(STORAGE_KEYS.visibleDaily, JSON.stringify(keys))
  }

  // Favorite zones
  const toggleFavorite = (z: string) => {
    setFavoriteZones(prev => {
      const next = prev.includes(z) ? prev.filter(x => x !== z) : [...prev, z].slice(0, 5)
      localStorage.setItem(STORAGE_KEYS.favs, JSON.stringify(next))
      return next
    })
  }

  // PWA install
  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setCanInstall(false)
      setInstallPrompt(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <main
        className="flex-1 w-full max-w-lg mx-auto px-4 pt-4 pb-32"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
      >
        {page === 'home' && (
          <HomePage
            zone={zone}
            onZoneChange={handleZoneChange}
            today={today}
            loading={loading}
            error={error}
            onRefetch={refetch}
            visiblePrayers={visiblePrayersDaily}
            favoriteZones={favoriteZones}
            onToggleFavorite={toggleFavorite}
          />
        )}
        {page === 'weekly'  && <WeeklyPage  zone={zone} />}
        {page === 'monthly' && <MonthlyPage zone={zone} />}
      </main>

      {canInstall && (
        <InstallBanner onInstall={handleInstallClick} onDismiss={() => setCanInstall(false)} />
      )}

      <BottomNavigation active={page} onChange={setPage} />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        notifSettings={notifSettings}
        onNotifChange={saveNotifSettings}
        onNotifToggle={toggleEnabled}
        permission={permission}
        azanEnabled={azanEnabled}
        onToggleAzan={toggleAzan}
        visiblePrayersDaily={visiblePrayersDaily}
        onVisiblePrayersDailyChange={saveVisiblePrayersDaily}
        favoriteZones={favoriteZones}
        onClearFavorites={() => {
          setFavoriteZones([])
          localStorage.setItem(STORAGE_KEYS.favs, '[]')
        }}
      />
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { BottomNavigation, type NavPage } from './components/BottomNavigation'
import { SettingsModal } from './components/SettingsModal'
import { HomePage } from './pages/Home'
import { WeeklyPage } from './pages/Weekly'
import { MonthlyPage } from './pages/Monthly'
import { useTodayPrayer } from './hooks/usePrayerTimes'
import { useNotifications } from './hooks/useNotifications'
import { useAzan } from './hooks/useAzan'
import { syncClock } from './services/timeSync'
import { DEFAULT_ZONE } from './utils/zones'

const STORAGE_KEYS = {
  zone:     'selected_zone',
  use24h:   'use_24h',
  azan:     'azan_enabled',
  favs:     'favorite_zones',
}

function loadPref<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    if (v === null) return fallback
    return JSON.parse(v) as T
  } catch { return fallback }
}

export default function App() {

  const [zone, setZone] = useState<string>(() => loadPref(STORAGE_KEYS.zone, DEFAULT_ZONE))
  const [page, setPage]     = useState<NavPage>('home')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [use24h, setUse24h] = useState<boolean>(() => loadPref(STORAGE_KEYS.use24h, false))
  const [azanEnabled, setAzanEnabled] = useState<boolean>(() => loadPref(STORAGE_KEYS.azan, true))
  const [favoriteZones, setFavoriteZones] = useState<string[]>(() => loadPref(STORAGE_KEYS.favs, []))
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [canInstall, setCanInstall] = useState(false)

  const { today, loading, error, refetch } = useTodayPrayer(zone)
  const { settings: notifSettings, saveSettings: saveNotifSettings, permission, requestPermission, toggleEnabled } = useNotifications(today)

  useAzan(today, azanEnabled)

  // Clock sync on mount
  useEffect(() => { syncClock() }, [])

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

  // Persist 24h
  const toggle24h = () => {
    setUse24h(v => {
      localStorage.setItem(STORAGE_KEYS.use24h, JSON.stringify(!v))
      return !v
    })
  }

  // Persist azan
  const toggleAzan = () => {
    setAzanEnabled(v => {
      localStorage.setItem(STORAGE_KEYS.azan, JSON.stringify(!v))
      return !v
    })
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
        onInstallClick={handleInstallClick}
        canInstall={canInstall}
      />

      {/* Main content */}
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
            use24h={use24h}
            favoriteZones={favoriteZones}
            onToggleFavorite={toggleFavorite}
          />
        )}
        {page === 'weekly' && (
          <WeeklyPage zone={zone} use24h={use24h} />
        )}
        {page === 'monthly' && (
          <MonthlyPage zone={zone} use24h={use24h} />
        )}
      </main>

      <BottomNavigation active={page} onChange={setPage} />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        notifSettings={notifSettings}
        onNotifChange={saveNotifSettings}
        onNotifToggle={toggleEnabled}
        permission={permission}
        use24h={use24h}
        onToggle24h={toggle24h}
        azanEnabled={azanEnabled}
        onToggleAzan={toggleAzan}
        favoriteZones={favoriteZones}
        onClearFavorites={() => {
          setFavoriteZones([])
          localStorage.setItem(STORAGE_KEYS.favs, '[]')
        }}
      />
    </div>
  )
}

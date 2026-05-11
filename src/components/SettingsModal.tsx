import { useTheme } from '../hooks/useTheme'
import type { NotificationSettings } from '../hooks/useNotifications'
import { PRAYER_META, PRAYER_KEYS, COUNTABLE_PRAYERS, type PrayerKey } from '../utils/prayerUtils'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  notifSettings: NotificationSettings
  onNotifChange: (s: NotificationSettings) => void
  onNotifToggle: () => void
  permission: NotificationPermission
  azanEnabled: boolean
  onToggleAzan: () => void
  visiblePrayersDaily: PrayerKey[]
  onVisiblePrayersDailyChange: (keys: PrayerKey[]) => void
  favoriteZones: string[]
  onClearFavorites: () => void
}

export function SettingsModal({
  open,
  onClose,
  notifSettings,
  onNotifChange,
  onNotifToggle,
  permission,
  azanEnabled,
  onToggleAzan,
  visiblePrayersDaily,
  onVisiblePrayersDailyChange,
  favoriteZones,
  onClearFavorites,
}: SettingsModalProps) {
  const { isDark, toggle } = useTheme()

  if (!open) return null

  const togglePrayer = (key: PrayerKey) => {
    const prayers = notifSettings.enabledPrayers.includes(key)
      ? notifSettings.enabledPrayers.filter(p => p !== key)
      : [...notifSettings.enabledPrayers, key]
    onNotifChange({ ...notifSettings, enabledPrayers: prayers })
  }

  const toggleDailyVisible = (key: PrayerKey) => {
    const isVisible = visiblePrayersDaily.includes(key)
    // Keep at least 1 visible
    if (isVisible && visiblePrayersDaily.length === 1) return
    const next = isVisible
      ? visiblePrayersDaily.filter(k => k !== key)
      : [...visiblePrayersDaily, key]
    // Preserve PRAYER_KEYS order
    onVisiblePrayersDailyChange(PRAYER_KEYS.filter(k => next.includes(k)))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className={`
        relative w-full max-w-lg mx-auto rounded-t-3xl sm:rounded-3xl shadow-2xl z-10
        max-h-[90vh] overflow-y-auto
        ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200'}
      `}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Tetapan</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Appearance */}
          <Section title="Penampilan" isDark={isDark}>
            <SettingRow
              label="Mod Gelap"
              desc="Tukar antara mod terang dan gelap"
              isDark={isDark}
            >
              <Toggle checked={isDark} onChange={toggle} />
            </SettingRow>
          </Section>

          {/* Daily prayer visibility */}
          <Section title="Waktu Solat Dipapar (Harian)" isDark={isDark}>
            <div className={`px-4 py-3.5 rounded-2xl ${isDark ? 'bg-transparent' : 'bg-white'}`}>
              <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pilih waktu solat yang ingin dipapar pada halaman utama
              </p>
              <div className="flex flex-wrap gap-2">
                {PRAYER_KEYS.map(key => {
                  const active = visiblePrayersDaily.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => toggleDailyVisible(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                        ${active
                          ? isDark ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40' : 'bg-primary-50 text-primary-700 border border-primary-300'
                          : isDark ? 'bg-white/5 text-slate-500 border border-white/10' : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }
                      `}
                    >
                      <span style={{
                        width: 12, height: 12, borderRadius: 2, flexShrink: 0,
                        border: `1.5px solid ${active ? '#10b981' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                        background: active ? '#10b981' : 'transparent',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {active && (
                          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                            <path d="M1 3.5L2.8 5.5L6 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
          </Section>

          {/* Notifications */}
          <Section title="Notifikasi" isDark={isDark}>
            {permission === 'denied' && (
              <p className="text-xs text-amber-500 mb-3">
                ⚠️ Notifikasi telah disekat. Sila benarkan dalam tetapan pelayar.
              </p>
            )}
            <SettingRow
              label="Peringatan Solat"
              desc="Terima notifikasi sebelum waktu solat"
              isDark={isDark}
            >
              <Toggle checked={notifSettings.enabled} onChange={onNotifToggle} />
            </SettingRow>

            {notifSettings.enabled && (
              <>
                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <label className={`text-sm font-medium block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Peringatan {notifSettings.reminderMinutes} minit sebelum
                  </label>
                  <input
                    type="range"
                    min={1} max={30} step={1}
                    value={notifSettings.reminderMinutes}
                    onChange={e => onNotifChange({ ...notifSettings, reminderMinutes: +e.target.value })}
                    className="w-full accent-primary-500"
                  />
                  <div className={`flex justify-between text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>1 min</span><span>30 min</span>
                  </div>
                </div>

                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Solat yang diaktifkan</p>
                  <div className="grid grid-cols-2 gap-2">
                    {COUNTABLE_PRAYERS.map(key => (
                      <button
                        key={key}
                        onClick={() => togglePrayer(key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all
                          ${notifSettings.enabledPrayers.includes(key)
                            ? isDark ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40' : 'bg-primary-50 text-primary-700 border border-primary-300'
                            : isDark ? 'bg-white/5 text-slate-400 border border-white/10' : 'bg-slate-50 text-slate-500 border border-slate-200'
                          }
                        `}
                      >
                        <span>{PRAYER_META[key].icon}</span>
                        <span>{PRAYER_META[key].nameMs}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Section>

          {/* Azan */}
          <Section title="Azan" isDark={isDark}>
            <SettingRow
              label="Azan Automatik"
              desc="Main azan apabila masuk waktu solat"
              isDark={isDark}
            >
              <Toggle checked={azanEnabled} onChange={onToggleAzan} />
            </SettingRow>
          </Section>

          {/* About */}
          <Section title="Tentang" isDark={isDark}>
            <SettingRow label="Versi Aplikasi" desc="Waktu Solat Malaysia" isDark={isDark}>
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>v1.0.0</span>
            </SettingRow>
            <SettingRow label="Sumber Data" desc="Jabatan Kemajuan Islam Malaysia" isDark={isDark}>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>JAKIM</span>
            </SettingRow>
            <SettingRow label="Kaedah Pengiraan" desc="Kiraan waktu solat rasmi Malaysia" isDark={isDark}>
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>e-Solat API</span>
            </SettingRow>
          </Section>

          {/* Developer */}
          <Section title="Pembangun" isDark={isDark}>
            <div className={`px-4 py-4 rounded-2xl ${isDark ? 'bg-transparent' : 'bg-white'}`}>
              <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dibangunkan oleh</p>
              <p className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Muhamad Darul Hadi</p>

              <div className="flex flex-col gap-2">
                <a
                  href="https://github.com/muhamaddarulhadi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                    ${isDark ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'}
                  `}
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Profil GitHub</p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>github.com/muhamaddarulhadi</p>
                  </div>
                  <svg className="w-3.5 h-3.5 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    style={{ color: isDark ? '#4b5563' : '#9ca3af' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <a
                  href="https://github.com/muhamaddarulhadi/e-Solat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                    ${isDark ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'}
                  `}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Source Code</p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>github.com/muhamaddarulhadi/e-Solat</p>
                  </div>
                  <svg className="w-3.5 h-3.5 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    style={{ color: isDark ? '#4b5563' : '#9ca3af' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <div>
      <h3 className={`text-xs font-bold uppercase tracking-widest mb-3`} style={{ color: '#10b981' }}>
        {title}
      </h3>
      <div className={`rounded-2xl border divide-y ${isDark ? 'border-white/10 divide-white/5' : 'border-slate-200 divide-slate-100'}`}>
        {children}
      </div>
    </div>
  )
}

function SettingRow({ label, desc, children, isDark }: { label: string; desc: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3.5 first:rounded-t-2xl last:rounded-b-2xl ${isDark ? 'bg-transparent' : 'bg-white'}`}>
      <div className="min-w-0">
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</p>
        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 flex-shrink-0
        ${checked ? 'bg-primary-500' : 'bg-slate-600'}
      `}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `} />
    </button>
  )
}

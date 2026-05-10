import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

// Kaabah coordinates
const KAABAH_LAT = 21.4225
const KAABAH_LNG = 39.8262

function calcQibla(lat: number, lng: number): number {
  const φ1 = (lat * Math.PI) / 180
  const φ2 = (KAABAH_LAT * Math.PI) / 180
  const Δλ = ((KAABAH_LNG - lng) * Math.PI) / 180

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  const θ = Math.atan2(y, x)
  return ((θ * 180) / Math.PI + 360) % 360
}

function calcDistance(lat: number, lng: number): number {
  const R = 6371
  const φ1 = (lat * Math.PI) / 180
  const φ2 = (KAABAH_LAT * Math.PI) / 180
  const Δφ = ((KAABAH_LAT - lat) * Math.PI) / 180
  const Δλ = ((KAABAH_LNG - lng) * Math.PI) / 180
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function QiblaCompass() {
  const { isDark } = useTheme()
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null)
  const [deviceHeading, setDeviceHeading] = useState(0)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const getLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Peranti anda tidak menyokong GPS')
      setStatus('error')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lng: longitude })
        setQiblaAngle(calcQibla(latitude, longitude))
        setDistance(calcDistance(latitude, longitude))
        setStatus('success')
      },
      err => {
        setErrorMsg('Akses lokasi ditolak. Sila benarkan akses lokasi.')
        setStatus('error')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const heading = (e as any).webkitCompassHeading ?? (e.alpha ? 360 - e.alpha : 0)
      setDeviceHeading(heading)
    }
    window.addEventListener('deviceorientationabsolute', handler as any, true)
    window.addEventListener('deviceorientation', handler as any, true)
    return () => {
      window.removeEventListener('deviceorientationabsolute', handler as any, true)
      window.removeEventListener('deviceorientation', handler as any, true)
    }
  }, [])

  const needleAngle = qiblaAngle !== null ? qiblaAngle - deviceHeading : 0

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-center">
        <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Arah Kiblat
        </h2>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Hala tuju menuju Kaabah, Makkah Al-Mukarramah
        </p>
      </div>

      {/* Compass Circle */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`w-64 h-64 rounded-full border-4 flex items-center justify-center relative
          ${isDark ? 'border-primary-700/50 bg-slate-800/50' : 'border-primary-200 bg-white shadow-xl'}
        `}>
          {/* Cardinal points */}
          {[
            { label: 'U', angle: 0,   top: '8px',    left: '50%', transform: 'translateX(-50%)' },
            { label: 'S', angle: 180, bottom: '8px', left: '50%', transform: 'translateX(-50%)' },
            { label: 'T', angle: 90,  top: '50%',    right: '8px',transform: 'translateY(-50%)' },
            { label: 'B', angle: 270, top: '50%',    left: '8px', transform: 'translateY(-50%)' },
          ].map(p => (
            <span key={p.label}
              className={`absolute text-xs font-bold z-10 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}
              style={{ top: p.top, bottom: p.bottom, left: p.left, right: p.right, transform: p.transform }}
            >
              {p.label}
            </span>
          ))}

          {/* Tick marks */}
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 10}deg)` }}>
              <div className={`absolute top-2 left-1/2 -translate-x-1/2
                ${i % 9 === 0 ? `w-0.5 h-4 ${isDark ? 'bg-primary-500' : 'bg-primary-400'}` : `w-px h-2 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}
              `} />
            </div>
          ))}

          {/* Qibla needle */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${needleAngle}deg)` }}>
            <div className="w-2 h-28 relative flex flex-col items-center">
              {/* North - Ka'bah direction */}
              <div className="w-2 h-16 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-full" />
              {/* South */}
              <div className={`w-1.5 h-12 rounded-b-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
            </div>
          </div>

          {/* Center Kaabah icon */}
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl z-10
              ${isDark ? 'bg-slate-900' : 'bg-white'}
            `}>
              🕋
            </div>
          </div>
        </div>

        {/* Angle badge */}
        {qiblaAngle !== null && (
          <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-bold
            ${isDark ? 'bg-primary-600 text-white' : 'bg-primary-600 text-white'} shadow-lg
          `}>
            {Math.round(qiblaAngle)}°
          </div>
        )}
      </div>

      {/* Info */}
      {status === 'success' && location && (
        <div className={`text-center space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <p className="text-sm">
            📍 {location.lat.toFixed(4)}°U, {location.lng.toFixed(4)}°T
          </p>
          {distance && (
            <p className={`font-semibold text-base ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              Jarak ke Kaabah: {Math.round(distance).toLocaleString()} km
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      {status === 'idle' || status === 'error' ? (
        <div className="text-center">
          {status === 'error' && (
            <p className="text-sm text-red-400 mb-3">{errorMsg}</p>
          )}
          <button onClick={getLocation} className="btn-primary px-6 py-3 text-base">
            📍 Kesan Lokasi Saya
          </button>
        </div>
      ) : status === 'loading' ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mengesan lokasi...</p>
        </div>
      ) : null}

      {status === 'success' && (
        <p className={`text-xs text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          Pastikan kompas peranti dikalibrasi untuk ketepatan terbaik
        </p>
      )}
    </div>
  )
}

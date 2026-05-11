# Waktu Solat Malaysia 🕌

A Progressive Web App (PWA) for Malaysia prayer times, built with React + TypeScript + Vite. Data is sourced from the official **e-Solat JAKIM** API.

Live demo: **https://muhamaddarulhadi.github.io/e-Solat/**

---

## Features

- **Today's prayer times** — full schedule for the current day with live countdown timer to the next prayer
- **Weekly & monthly schedule** — scrollable tables with today highlighted and drag-to-scroll support
- **Column visibility toggle** — show/hide individual prayer columns on weekly & monthly tables (saved per view)
- **All 14 states & 73 zones** — searchable by state name or district; zone code hidden for a cleaner UI
- **Automatic countdown** — live clock and countdown (hours : minutes : seconds) to the next prayer in AM/PM format
- **Azan alert** — plays an azan sound in-browser when a prayer time is reached
- **Push notifications** — optional browser notifications for each prayer (configurable per prayer in Settings)
- **Dark / light theme** — persists across sessions
- **Hijri date** — displayed on the home screen using the API-provided Hijri date
- **Favourite zones** — pin up to 5 zones for quick one-tap switching
- **Visible prayers (Settings)** — choose which prayers appear on the home daily card (independent from table settings)
- **In-app install banner** — a banner automatically appears at the bottom of the screen when the browser is ready to install the PWA; one tap installs instantly
- **Offline support** — previously loaded data is cached by the service worker and available without internet

---

## Screenshots

> _(Add screenshots here)_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Date handling | Day.js (Malay locale) |
| HTTP client | Axios |
| PWA | Manual `sw.js` + `manifest.json` |
| Deployment | GitHub Actions → GitHub Pages |
| Data source | e-Solat JAKIM API |

---

## Project Structure

```
src/
├── components/
│   ├── BottomNavigation.tsx   # Tab bar (Home / Weekly / Monthly)
│   ├── CountdownTimer.tsx     # Live clock + next prayer countdown card
│   ├── Header.tsx             # App bar with theme toggle and settings button
│   ├── HijriDate.tsx          # Hijri calendar display
│   ├── InstallBanner.tsx      # Auto-appearing PWA install banner
│   ├── PrayerCard.tsx         # Single prayer time card (home page)
│   ├── PrayerTable.tsx        # Weekly / monthly table with column toggle & drag scroll
│   ├── SettingsModal.tsx      # Settings drawer (notifications, azan, visible prayers)
│   └── ZoneSelector.tsx       # Searchable zone picker (state + district)
├── contexts/
│   └── ThemeContext.tsx        # Global dark/light theme state
├── hooks/
│   ├── useAzan.ts             # Plays azan sound at prayer time
│   ├── useCountdown.ts        # Computes next prayer + live countdown
│   ├── useNotifications.ts    # Browser push notification scheduling
│   ├── usePrayerTimes.ts      # Data fetching hook (today / week / month)
│   └── useTheme.ts            # Re-exports ThemeContext
├── pages/
│   ├── Home.tsx               # Home tab
│   ├── Monthly.tsx            # Monthly schedule tab
│   └── Weekly.tsx             # Weekly schedule tab
├── services/
│   └── prayerApi.ts           # e-Solat API client + in-memory cache
└── utils/
    ├── hijriDate.ts           # Gregorian → Hijri conversion helper
    ├── prayerUtils.ts         # Prayer keys, metadata, AM/PM time formatting
    └── zones.ts               # All 73 Malaysia prayer zones with state & district info
public/
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker (cache + offline)
└── icons/                     # App icons (192 px & 512 px)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run locally

```bash
git clone https://github.com/muhamaddarulhadi/e-Solat.git
cd e-Solat
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> The dev server includes a proxy so API calls to `e-solat.gov.my` are forwarded automatically — no CORS issues in development.

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## CORS Handling

The e-Solat JAKIM API does not send CORS headers for browser requests.

| Environment | Solution |
|---|---|
| Development | Vite dev proxy (`/api/solat` → `https://www.e-solat.gov.my`) |
| Production | Requests routed through [corsproxy.io](https://corsproxy.io) |

---

## Deployment (GitHub Pages)

The project includes a GitHub Actions workflow that builds and deploys automatically on every push to `main`.

### First-time setup

1. Push the repo to GitHub
2. Go to **Settings → Pages → Source** and select **GitHub Actions**
3. Push any commit to `main` — the workflow will build and deploy automatically

The workflow file is at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## PWA Installation

When you open the deployed site in a supported browser, an **install banner** automatically appears at the bottom of the screen. Tap **"Pasang"** to install the app instantly — no extra steps needed.

### Manual install (if banner does not appear)

| Platform | Steps |
|---|---|
| Android (Chrome) | Tap the **⋮ menu** → **Add to Home Screen** |
| iOS (Safari) | Tap **Share** → **Add to Home Screen** |
| Desktop (Chrome / Edge) | Click the **⊕** icon in the address bar |

> The install banner only appears when the browser determines the PWA criteria are met (served over HTTPS, valid manifest, active service worker).

---

## Prayer Zones

All 73 JAKIM prayer zones are supported, covering all 14 Malaysian states and federal territories:

Johor · Kedah · Kelantan · Melaka · Negeri Sembilan · Pahang · Perak · Perlis · Pulau Pinang · Sabah · Sarawak · Selangor · Terengganu · W.P. Kuala Lumpur · W.P. Labuan · W.P. Putrajaya

---

## Local Storage

All user preferences are stored per device, per browser. Each user's data is completely independent.

| Key | Description |
|---|---|
| `selected_zone` | Last selected prayer zone |
| `azan_enabled` | Azan audio on/off |
| `favorite_zones` | Up to 5 pinned zones |
| `visible_prayers_daily` | Which prayers appear on the home page |
| `visible_prayers_weekly` | Which columns appear in the weekly table |
| `visible_prayers_monthly` | Which columns appear in the monthly table |
| `theme` | Dark or light mode preference |
| `notif_settings` | Per-prayer notification preferences |

---

## Data Source

Prayer times are provided by the official **e-Solat** system maintained by **JAKIM** (Jabatan Kemajuan Islam Malaysia).

API endpoint: `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat`

---

## License

MIT — free to use, modify, and distribute.

---

## Created by

**Muhamad Darul Hadi**
- GitHub: [@muhamaddarulhadi](https://github.com/muhamaddarulhadi)
- Repository: [github.com/muhamaddarulhadi/e-Solat](https://github.com/muhamaddarulhadi/e-Solat)

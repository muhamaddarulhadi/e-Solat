# Waktu Solat Malaysia 🕌

A Progressive Web App (PWA) for Malaysia prayer times, built with React + TypeScript + Vite. Data is sourced from the official **e-Solat JAKIM** API.

Live demo: **https://muhamaddarulhadi.github.io/e-Solat/**

---

## Features

- **Today's prayer times** — full schedule for the current day with countdown timer to the next prayer
- **Weekly & monthly schedule** — scrollable tables with today highlighted
- **All 14 states & 73 zones** — searchable by state name, zone code, or district name
- **Automatic countdown** — live clock and countdown (hours : minutes : seconds) to the next prayer
- **Azan alert** — plays an azan sound in-browser when a prayer time is reached
- **Push notifications** — optional browser notifications for each prayer (configurable per prayer)
- **12h / 24h toggle** — switch between AM/PM and 24-hour display
- **Dark / light theme** — system-default, persists across sessions
- **Hijri date** — displayed on the home screen
- **CSV export** — download the monthly schedule as a `.csv` file
- **Offline support** — previously loaded data is cached and available without internet
- **Installable PWA** — install on Android, iOS, Windows, or macOS like a native app
- **Favourite zones** — pin up to 5 zones for quick switching

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
│   ├── Header.tsx             # App bar with settings and install button
│   ├── HijriDate.tsx          # Hijri calendar display
│   ├── PrayerCard.tsx         # Single prayer time card (home page)
│   ├── PrayerTable.tsx        # Weekly / monthly table with sticky date column
│   ├── SettingsModal.tsx      # Settings drawer
│   └── ZoneSelector.tsx       # Searchable zone picker
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
│   ├── prayerApi.ts           # e-Solat API client + in-memory cache
│   └── timeSync.ts            # Sync local clock with server time
└── utils/
    ├── hijriDate.ts           # Gregorian → Hijri conversion
    ├── prayerUtils.ts         # Prayer keys, metadata, date/time helpers
    └── zones.ts               # All 73 Malaysia prayer zones
public/
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker (cache + offline)
└── icons/                     # App icons (72 → 512 px)
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
3. Push any commit to `main` — the workflow will build and deploy

The workflow file is at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## PWA Installation

### Android (Chrome)
Open the site → tap the **"Add to Home Screen"** banner or the install icon in the address bar.

### iOS (Safari)
Open the site → tap **Share** → **Add to Home Screen**.

### Desktop (Chrome / Edge)
Open the site → click the **⊕ install** icon in the browser address bar.

---

## Prayer Zones

All 73 JAKIM prayer zones are supported, covering all 14 Malaysian states and federal territories:

Johor · Kedah · Kelantan · Melaka · Negeri Sembilan · Pahang · Perak · Perlis · Pulau Pinang · Sabah · Sarawak · Selangor · Terengganu · W.P. Kuala Lumpur · W.P. Labuan · W.P. Putrajaya

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

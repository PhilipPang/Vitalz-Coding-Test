# Monitoring Dashboard (React + TypeScript)

A small, production‑style dashboard that visualizes user sleep, score, and daily statics from the provided Vitalz API. Built with **Vite + React + TypeScript**, **TanStack Query** (data fetching & caching), **TailwindCSS** (styling), and **Recharts** (charts).

## ✨ Features

* **User list** fetched from `/api/getUserList` with clear mapping of `UserName`, `LoginEmail`, `DeviceCompany`, `DeviceUserID`.
* **Live search dropdown** (autocomplete) for **email, username, device company**.
* **Filter by device company** beside the user/date pickers.
* **Sleep trend**: total sleep **hours per day**.
* **Score gauge**: latest **non‑zero** `VitalzScore`.
* **Daily statics summary** for selected date: Avg HR, Avg HRV, Avg SpO₂, sample count.
* **Resilient API layer** with typed responses and graceful error+loading states.

## 🧱 Tech Stack

* React 18 + TypeScript
* Vite 5
* TailwindCSS 3
* @tanstack/react-query 5
* Recharts 2

## ⚙️ Requirements

* **Node.js** ≥ 18 (recommended LTS)
* npm ≥ 9

## 🚀 Quick Start

```bash
# 1) Install deps
npm i

# 2) Start the dev server (has proxy for /api to avoid CORS)
npm run dev
```

Open the printed **[http://localhost:5173](http://localhost:5173)** URL.

## 🔌 API Base & CORS

This repo uses the Vite **dev proxy** so that browser requests go to `http://localhost:5173/api/*` and are proxied server‑side to the Vitalz backend:

* **`vite.config.ts`**

```ts
server: {
  proxy: {
    '/api': {
      target: 'https://exam-vitalz-backend-8267f8929b82.herokuapp.com',
      changeOrigin: true,
      secure: true,
    },
  },
}
```

> **Important:** In development, the fetcher forces the proxy (BASE is empty). Do **not** set `VITE_API_BASE` while developing, or you may see CORS errors.

### Optional `.env` (for non‑proxy production builds)

Create `.env` **only if** you want to bypass the proxy:

```env
VITE_API_BASE=https://exam-vitalz-backend-8267f8929b82.herokuapp.com
```

## 📂 Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview"
}
```

## 🗂️ Project Structure

```
src/
  api/
    client.ts        # fetch wrapper
    vitalz.ts        # typed endpoints
  components/
    SearchUsers.tsx  # live search dropdown
    SleepChart.tsx   # sleep hours timeline
    ScoreGauge.tsx   # radial gauge for VitalzScore
    StatGrid.tsx     # summary cards for statics
    UserPicker.tsx   # compact select control
    ui/              # Button, Card, Select, SearchInput, Skeleton
  hooks/
    useVitalz.ts     # useUserList + useUserData with selects/mappers
  lib/
    utils.ts         # small helpers
  pages/
    Dashboard.tsx    # main page layout
  types/
    api.ts           # request/response + UI types
App.tsx, main.tsx, index.css
```

## 🔁 Data Flow

* **User list**: `/api/getUserList` → `GetUserListResponse` → mapped to `UserIdentity` { **loginEmail**, **deviceUserId**, **name**, **company**, **email**, **label** }.
* **Sleep**: `/api/getUserSleepData` → rows mapped to `SleepPoint`: `{ date, hours, deepPct, lightPct, awakePct }` where `hours = TotalTimeAsleep / 3600`.
* **Score**: `/api/getUserScore` → latest **non‑zero** `VitalzScore` (falls back to latest if all zero).
* **Statics**: `/api/getUserStatics?Date=YYYY-MM-DD` → aggregated averages: `AvgHR`, `AvgHRV`, `AvgOxygenSaturation`, `Samples`.

## 🧭 Usage

1. Use the **Search users** bar (top) to live search by email / username / company. Select a result to set the user.
2. Optionally **Filter by company** (dropdown to the right of the user/date inputs). This narrows the user picker.
3. Pick a **date** that has data (e.g., `2023-12-17` from sample payloads).
4. View **sleep trend**, **score gauge**, and **daily statics**.

## 🔒 Troubleshooting

### CORS: `No 'Access-Control-Allow-Origin'`

* Use `npm run dev` (proxy enabled). Do **not** use `vite preview` or a production build locally unless you configure rewrites.
* Ensure `.env` **does not** set `VITE_API_BASE` in dev.
* In Network tab, the request URL should be `http://localhost:5173/api/...` (not the Heroku origin).

### Type errors / `raw.map is not a function`

* `getUserList` must return `{ status: number, data: [] }`. The app expects `raw.data` to be an array.

### Empty charts or no statics

* Choose a date that exists in the dataset (e.g., `2024-12-17`).
* Ensure `LoginEmail` and `DeviceUserID` are passed from the selected user.

## 📦 Build

```bash
npm run build
npm run preview   # serves the built files (no proxy)
```

> If you preview a production build locally, browser requests will go directly to the remote API; you must set up a reverse proxy (see below) or enable CORS server‑side.

## ☁️ Deployment (Proxies for Production)

To avoid CORS in production, configure a rewrite/proxy on your host so `/api/*` is forwarded to the Vitalz backend.

**Vercel** — `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://exam-vitalz-backend-8267f8929b82.herokuapp.com/api/$1" }
  ]
}
```

**Netlify** — `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://exam-vitalz-backend-8267f8929b82.herokuapp.com/api/:splat"
  status = 200
  force = true
```

**Static hosting + custom proxy**

* Keep `fetch` base relative ("/api").
* Put a reverse proxy (NGINX/Cloudflare Workers/Express) in front of the static site.

## 🧪 Extending

* Add stacked bars for **Deep/Light/Awake %**.
* Add time‑series chart for **HR/HRV/SpO₂** on selected date.
* Replace heuristics with zod validators if the API becomes strictly typed.
* Add tests: Vitest + React Testing Library.

## 📜 License

MIT (or adapt to your organization’s standard).

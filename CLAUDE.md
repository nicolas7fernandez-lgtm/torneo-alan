# App Torneo Alan — Project Instructions

## What this is
Web app for Nico and Alan to track tournament scores across 4 sports in real time. Anyone with the link can update scores. Mobile-first, designed for iPhone 16.

## Tech Stack
| Layer | Tool |
|-------|------|
| Frontend | React + TypeScript + Vite |
| Styles | Tailwind CSS v3 |
| Database | Firebase Firestore (real-time) |
| Hosting | Vercel |

## Scoring rules
| Sport | Fecha point | Torneo point | Notes |
|-------|-------------|--------------|-------|
| Basketball | 1 per match won | 7 fecha points | Auto-converts. "Canjeados" = settled wins. |
| Squash | 1 per match won | — | Only fechas |
| Age of Empires | 1 per match won | 50 fecha points | Cycle counter resets per torneo won |
| Ping Pong | 1 per match won | — | Only fechas for now |

## Firestore structure
Collection `scores` with 4 documents:
- `basketball` → `torneosPrevios`, `torneoActual`, `fechaActual`
- `squash` → `fechas`
- `aoe` → `fechas`, `torneos`
- `pingpong` → `fechas`

## Key files
- `frontend/src/components/` — one component per sport + NavBar
- `frontend/src/hooks/useScores.ts` — real-time Firestore listeners
- `frontend/src/lib/firebase.ts` — Firebase init + exports
- `frontend/src/types/index.ts` — TypeScript types
- `tools/seed_firebase.mjs` — one-shot seed script

## Setup (first time)
1. Create Firebase project at console.firebase.google.com
2. Enable Firestore in test mode
3. Copy config values into `frontend/.env` (see `.env.example`)
4. Run seed: `node tools/seed_firebase.mjs`
5. `cd frontend && npm run dev`

## Deploy to Vercel
1. Push to GitHub
2. Import repo in vercel.com
3. Set the same `VITE_FIREBASE_*` env vars in Vercel dashboard
4. Vercel auto-deploys on every push

/**
 * One-time seed script to load initial scores into Firestore.
 * Run from the project root:
 *   node tools/seed_firebase.mjs
 *
 * Requires: VITE_FIREBASE_* vars set in frontend/.env
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from frontend/
const envPath = resolve(__dirname, '../frontend/.env');
const envVars = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => l.split('=').map((s) => s.trim()))
);

const firebaseConfig = {
  apiKey: envVars['VITE_FIREBASE_API_KEY'],
  authDomain: envVars['VITE_FIREBASE_AUTH_DOMAIN'],
  projectId: envVars['VITE_FIREBASE_PROJECT_ID'],
  storageBucket: envVars['VITE_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: envVars['VITE_FIREBASE_MESSAGING_SENDER_ID'],
  appId: envVars['VITE_FIREBASE_APP_ID'],
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const INITIAL_DATA = {
  basketball: {
    torneosPrevios: { nico: 6, nicoCanjados: 4, alan: 0, alanCanjados: 0 },
    torneoActual: { nico: 7, alan: 2 },
    fechaActual: { number: 10, nico: 0, alan: 0 },
  },
  squash: {
    fechas: { nico: 2, alan: 1 },
  },
  aoe: {
    fechas: { nico: 38, alan: 36 },
    torneos: { nico: 1, alan: 0 },
  },
  pingpong: {
    fechas: { nico: 5, alan: 3 },
  },
};

async function seed() {
  for (const [sport, data] of Object.entries(INITIAL_DATA)) {
    await setDoc(doc(db, 'scores', sport), data);
    console.log(`✓ ${sport} seeded`);
  }
  console.log('\nDone! All scores loaded.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

import { useState, useEffect } from 'react';
import { db, doc, onSnapshot, collection, query, orderBy, limit } from '../lib/firebase';
import type { BasketballData, SquashData, AoeData, PingPongData, HistoryEntry } from '../types';

const DEFAULTS = {
  basketball: {
    torneosPrevios: { nico: 6, nicoCanjados: 4, alan: 0, alanCanjados: 0 },
    torneoActual: { nico: 7, alan: 2 },
    fechaActual: { number: 10, nico: 0, alan: 0 },
  } as BasketballData,
  squash: { fechas: { nico: 2, alan: 1 }, torneos: { nico: 0, alan: 0 } } as SquashData,
  aoe: { fechas: { nico: 38, alan: 36 }, torneos: { nico: 1, alan: 0 } } as AoeData,
  pingpong: { fechas: { nico: 5, alan: 3 } } as PingPongData,
};

export function useBasketball() {
  const [data, setData] = useState<BasketballData>(DEFAULTS.basketball);
  useEffect(() => {
    return onSnapshot(doc(db, 'scores', 'basketball'), (snap) => {
      if (snap.exists()) setData(snap.data() as BasketballData);
    });
  }, []);
  return data;
}

export function useSquash() {
  const [data, setData] = useState<SquashData>(DEFAULTS.squash);
  useEffect(() => {
    return onSnapshot(doc(db, 'scores', 'squash'), (snap) => {
      if (snap.exists()) setData(snap.data() as SquashData);
    });
  }, []);
  return data;
}

export function useAoe() {
  const [data, setData] = useState<AoeData>(DEFAULTS.aoe);
  useEffect(() => {
    return onSnapshot(doc(db, 'scores', 'aoe'), (snap) => {
      if (snap.exists()) setData(snap.data() as AoeData);
    });
  }, []);
  return data;
}

export function usePingPong() {
  const [data, setData] = useState<PingPongData>(DEFAULTS.pingpong);
  useEffect(() => {
    return onSnapshot(doc(db, 'scores', 'pingpong'), (snap) => {
      if (snap.exists()) setData(snap.data() as PingPongData);
    });
  }, []);
  return data;
}

const SPORT_LABELS: Record<string, string> = {
  basketball: '🏀 Básquet',
  squash: '🎾 Squash',
  aoe: '⚔️ Age of Empires',
  pingpong: '🏓 Ping Pong',
};

export interface LastActivity extends HistoryEntry {
  sport: string;
  sportLabel: string;
}

export function useLastActivity() {
  const [activity, setActivity] = useState<LastActivity | null>(null);

  useEffect(() => {
    const sports = ['basketball', 'squash', 'aoe', 'pingpong'];
    const latest: Record<string, LastActivity> = {};

    const unsubs = sports.map(sport =>
      onSnapshot(
        query(collection(db, 'scores', sport, 'history'), orderBy('timestamp', 'desc'), limit(1)),
        snap => {
          if (!snap.empty) {
            const d = snap.docs[0];
            latest[sport] = { id: d.id, sport, sportLabel: SPORT_LABELS[sport], ...d.data() } as LastActivity;
          }
          const all = Object.values(latest);
          if (all.length > 0) {
            setActivity(all.reduce((a, b) =>
              (a.timestamp?.seconds ?? 0) >= (b.timestamp?.seconds ?? 0) ? a : b
            ));
          }
        }
      )
    );

    return () => unsubs.forEach(u => u());
  }, []);

  return activity;
}

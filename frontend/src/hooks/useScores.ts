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

const SPORT_LABELS: Record<string, { label: string; emoji: string }> = {
  basketball: { label: 'Básquet',       emoji: '🏀' },
  squash:     { label: 'Squash',         emoji: '🎾' },
  aoe:        { label: 'Age of Empires', emoji: '⚔️' },
  pingpong:   { label: 'Ping Pong',      emoji: '🏓' },
};

export interface SportSummary {
  sport: string;
  emoji: string;
  label: string;
  nicoNet: number;
  alanNet: number;
  lastTs: number;
}

export function useTodayActivity(): SportSummary[] {
  const [summaries, setSummaries] = useState<SportSummary[]>([]);

  useEffect(() => {
    const sports = ['basketball', 'squash', 'aoe', 'pingpong'];
    const buckets: Record<string, HistoryEntry[]> = {};

    const rebuild = () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const since = startOfDay.getTime() / 1000;

      const result: SportSummary[] = [];
      for (const s of sports) {
        const entries = (buckets[s] ?? []).filter(e => (e.timestamp?.seconds ?? 0) >= since);
        if (!entries.length) continue;

        let nicoNet = 0, alanNet = 0, lastTs = 0;
        for (const e of entries) {
          const m = e.action.match(/^([+\-−])1.+para (nico|alan)/i);
          if (m) {
            const sign = m[1] === '+' ? 1 : -1;
            if (m[2].toLowerCase() === 'nico') nicoNet += sign;
            else alanNet += sign;
          }
          lastTs = Math.max(lastTs, e.timestamp?.seconds ?? 0);
        }
        result.push({ sport: s, ...SPORT_LABELS[s], nicoNet, alanNet, lastTs });
      }

      result.sort((a, b) => b.lastTs - a.lastTs);
      setSummaries(result);
    };

    const unsubs = sports.map(sport =>
      onSnapshot(
        query(collection(db, 'scores', sport, 'history'), orderBy('timestamp', 'desc'), limit(100)),
        snap => {
          buckets[sport] = snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryEntry));
          rebuild();
        }
      )
    );

    return () => unsubs.forEach(u => u());
  }, []);

  return summaries;
}

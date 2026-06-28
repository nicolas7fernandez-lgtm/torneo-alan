import { useState, useEffect } from 'react';
import { db, collection, query, orderBy, where, onSnapshot, Timestamp } from '../lib/firebase';
import type { HistoryEntry } from '../types';

const SPORTS = ['basketball', 'squash', 'aoe', 'pingpong'];

function dayKey(seconds: number): string {
  const d = new Date(seconds * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface DayPoint {
  date: string;   // 'YYYY-MM-DD'
  nico: number;   // cumulative points
  alan: number;
}

export function useTrendData(days: number | null): DayPoint[] {
  const [data, setData] = useState<DayPoint[]>([]);

  useEffect(() => {
    const buckets: Record<string, HistoryEntry[]> = {};

    const rebuild = () => {
      const all = Object.values(buckets).flat();
      all.sort((a, b) => (a.timestamp?.seconds ?? 0) - (b.timestamp?.seconds ?? 0));
      if (!all.length) { setData([]); return; }

      const daily: Record<string, { nico: number; alan: number }> = {};
      for (const e of all) {
        const ts = e.timestamp?.seconds;
        if (!ts) continue;
        const m = e.action.match(/^([+\-−])1.+para (nico|alan)/i);
        if (!m) continue;
        const sign = m[1] === '+' ? 1 : -1;
        const player = m[2].toLowerCase() as 'nico' | 'alan';
        const k = dayKey(ts);
        if (!daily[k]) daily[k] = { nico: 0, alan: 0 };
        daily[k][player] += sign;
      }

      const sorted = Object.keys(daily).sort();
      let nicoSum = 0, alanSum = 0;
      setData(sorted.map(date => {
        nicoSum += Math.max(0, daily[date].nico);
        alanSum += Math.max(0, daily[date].alan);
        return { date, nico: nicoSum, alan: alanSum };
      }));
    };

    const cutoff = days
      ? Timestamp.fromDate(new Date(Date.now() - days * 86400_000))
      : null;

    const unsubs = SPORTS.map(sport => {
      const q = cutoff
        ? query(collection(db, 'scores', sport, 'history'), orderBy('timestamp', 'asc'), where('timestamp', '>=', cutoff))
        : query(collection(db, 'scores', sport, 'history'), orderBy('timestamp', 'asc'));
      return onSnapshot(q, snap => {
        buckets[sport] = snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryEntry));
        rebuild();
      });
    });

    return () => unsubs.forEach(u => u());
  }, [days]);

  return data;
}

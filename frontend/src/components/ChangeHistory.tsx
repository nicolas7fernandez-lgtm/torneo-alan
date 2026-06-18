import { useEffect, useState } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot } from '../lib/firebase';
import type { HistoryEntry } from '../types';

function timeAgo(ts: { seconds: number } | null): string {
  if (!ts) return '...';
  const date = new Date(ts.seconds * 1000);
  const diff = Math.floor((Date.now() - ts.seconds * 1000) / 1000);

  if (diff < 60) return 'ahora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;

  const now = new Date();
  const hhmm = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return `hoy ${hhmm}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `ayer ${hhmm}`;

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm} ${hhmm}`;
}

export default function ChangeHistory({ sport }: { sport: string }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'scores', sport, 'history'),
      orderBy('timestamp', 'desc'),
      limit(15),
    );
    return onSnapshot(q, snap => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryEntry)));
    });
  }, [sport]);

  // re-render every 30s so relative times ("ahora", "2min") stay accurate
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!entries.length) return null;

  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
      <h3 className="text-xs text-gray-500 uppercase tracking-widest">Historial</h3>
      <div className="space-y-2">
        {entries.map(e => (
          <div key={e.id} className="flex items-baseline gap-2 text-xs">
            <span className="text-gray-600 shrink-0 w-16 text-right">{timeAgo(e.timestamp)}</span>
            <span className="text-gray-500">·</span>
            <span>
              <span className="text-orange-400 font-medium">{e.author}</span>
              <span className="text-gray-400"> {e.action}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

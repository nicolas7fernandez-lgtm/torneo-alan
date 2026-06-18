import { useEffect, useState } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot } from '../lib/firebase';
import type { HistoryEntry } from '../types';

function timeAgo(ts: { seconds: number } | null): string {
  if (!ts) return '...';
  const diff = Math.floor(Date.now() / 1000 - ts.seconds);
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function ChangeHistory({ sport }: { sport: string }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

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

  if (!entries.length) return null;

  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
      <h3 className="text-xs text-gray-500 uppercase tracking-widest">Historial</h3>
      <div className="space-y-2">
        {entries.map(e => (
          <div key={e.id} className="flex items-baseline gap-2 text-xs">
            <span className="text-gray-600 shrink-0 w-10 text-right">{timeAgo(e.timestamp)}</span>
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

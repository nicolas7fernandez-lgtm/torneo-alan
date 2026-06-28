import { useEffect, useState } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot } from '../lib/firebase';
import type { HistoryEntry } from '../types';

const PAGE_SIZE = 10;

function timeAgo(ts: { seconds: number } | null): string {
  if (!ts) return '...';
  const date = new Date(ts.seconds * 1000);
  const diff = Math.floor((Date.now() - ts.seconds * 1000) / 1000);
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  const now = new Date();
  const hhmm = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === now.toDateString()) return `hoy ${hhmm}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `ayer ${hhmm}`;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm} ${hhmm}`;
}

export default function ChangeHistory({ sport }: { sport: string }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [page, setPage] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'scores', sport, 'history'), orderBy('timestamp', 'desc'), limit(200));
    return onSnapshot(q, snap => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryEntry)));
      setPage(0);
    });
  }, [sport]);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!entries.length) return null;

  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const pageEntries = entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-4 space-y-3 border border-green-900/30">
      <div className="flex items-center justify-between">
        <h3 className="text-xs text-green-900 uppercase tracking-widest">Historial</h3>
        {totalPages > 1 && (
          <span className="text-xs text-green-900/60">{page + 1} / {totalPages}</span>
        )}
      </div>

      <div className="space-y-2">
        {pageEntries.map(e => (
          <div key={e.id} className="flex items-baseline gap-2 text-xs">
            <span className="text-green-900 shrink-0 w-16 text-right">{timeAgo(e.timestamp)}</span>
            <span className="text-green-900">·</span>
            <span>
              <span className="text-orange-400 font-medium">{e.author}</span>
              <span className="text-gray-400"> {e.action}</span>
            </span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-1">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg text-xs text-green-800 bg-green-950/40 border border-green-900/30 disabled:opacity-30 active:bg-green-900/40"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 rounded-lg text-xs text-green-800 bg-green-950/40 border border-green-900/30 disabled:opacity-30 active:bg-green-900/40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

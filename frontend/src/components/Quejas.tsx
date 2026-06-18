import { useEffect, useState } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from '../lib/firebase';
import { getStoredName } from '../hooks/usePlayerName';

const MAX_CHARS = 150;

interface Queja {
  id: string;
  text: string;
  author: string;
  timestamp: { seconds: number } | null;
}

function timeAgo(ts: { seconds: number } | null): string {
  if (!ts) return '...';
  const date = new Date(ts.seconds * 1000);
  const diff = Math.floor((Date.now() - ts.seconds * 1000) / 1000);
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`;
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

export default function Quejas() {
  const [quejas, setQuejas] = useState<Queja[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'quejas'), orderBy('timestamp', 'desc'), limit(20)),
      snap => setQuejas(snap.docs.map(d => ({ id: d.id, ...d.data() } as Queja)))
    );
  }, []);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    await addDoc(collection(db, 'quejas'), {
      text: trimmed,
      author: getStoredName(),
      timestamp: serverTimestamp(),
    });
    setText('');
    setSending(false);
  };

  const remaining = MAX_CHARS - text.length;

  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
      <h3 className="text-sm font-bold text-gray-200">😤 Quejas</h3>

      {quejas.length > 0 && (
        <div className="space-y-3">
          {quejas.map(q => (
            <div key={q.id} className="space-y-0.5">
              <div className="flex items-baseline gap-2 text-xs">
                <span className="text-orange-400 font-medium">{q.author}</span>
                <span className="text-gray-600">{timeAgo(q.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-300 leading-snug">{q.text}</p>
            </div>
          ))}
        </div>
      )}

      {quejas.length > 0 && <div className="border-t border-gray-800" />}

      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Escribí tu queja..."
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400 resize-none transition-colors"
          />
          <span className={`absolute bottom-2 right-3 text-xs ${remaining < 20 ? 'text-orange-400' : 'text-gray-600'}`}>
            {remaining}
          </span>
        </div>
        <button
          onClick={submit}
          disabled={!text.trim() || sending}
          className="w-full py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium disabled:opacity-30 transition-colors active:scale-95"
        >
          Enviar queja
        </button>
      </div>
    </div>
  );
}

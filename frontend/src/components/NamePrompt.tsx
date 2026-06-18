import { useState } from 'react';
import { usePlayerName } from '../hooks/usePlayerName';

export default function NamePrompt() {
  const { needsName, saveName } = usePlayerName();
  const [input, setInput] = useState('');

  if (!needsName) return null;

  const confirm = () => { if (input.trim()) saveName(input); };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm space-y-5">
        <div className="text-center space-y-1">
          <div className="text-3xl">👤</div>
          <h2 className="text-xl font-bold">¿Cómo te llamás?</h2>
          <p className="text-gray-400 text-sm">Tu nombre se guarda en este dispositivo y aparece en el historial de cambios.</p>
        </div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') confirm(); }}
          placeholder="Ej: Nico"
          maxLength={20}
          autoFocus
          className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-orange-400 transition-colors"
        />
        <button
          onClick={confirm}
          disabled={!input.trim()}
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg disabled:opacity-30 transition-colors active:scale-95"
        >
          Listo
        </button>
      </div>
    </div>
  );
}

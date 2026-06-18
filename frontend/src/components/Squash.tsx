import { db, doc, updateDoc, increment } from '../lib/firebase';
import { logHistory } from '../lib/history';
import { useSquash } from '../hooks/useScores';
import ChangeHistory from './ChangeHistory';
import type { Player } from '../types';

async function addPoint(player: Player) {
  await updateDoc(doc(db, 'scores', 'squash'), { [`fechas.${player}`]: increment(1) });
  await logHistory('squash', `+1 fecha para ${player}`);
}

async function removePoint(player: Player, current: number) {
  if (current <= 0) return;
  await updateDoc(doc(db, 'scores', 'squash'), { [`fechas.${player}`]: increment(-1) });
  await logHistory('squash', `-1 fecha para ${player}`);
}

export default function Squash() {
  const data = useSquash();
  const leader =
    data.fechas.nico > data.fechas.alan ? 'Nico lidera'
    : data.fechas.alan > data.fechas.nico ? 'Alan lidera'
    : 'Empate';

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center text-green-400">🎾 Squash</h1>

      <div className="bg-gray-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest text-center">Fechas ganadas</h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-6xl font-black text-blue-400">{data.fechas.nico}</div>
            <div className="text-sm text-gray-400">Nico</div>
          </div>
          <div className="text-gray-600 text-3xl font-thin">—</div>
          <div className="text-center">
            <div className="text-6xl font-black text-red-400">{data.fechas.alan}</div>
            <div className="text-sm text-gray-400">Alan</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500">{leader}</div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => addPoint('nico')} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg active:scale-95 transition-transform">+1 Nico</button>
          <button onClick={() => removePoint('nico', data.fechas.nico)} className="w-full py-2 rounded-xl bg-gray-700 text-gray-400 text-sm active:bg-gray-600 active:scale-95 transition-transform">−1 Nico</button>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => addPoint('alan')} className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-lg active:scale-95 transition-transform">+1 Alan</button>
          <button onClick={() => removePoint('alan', data.fechas.alan)} className="w-full py-2 rounded-xl bg-gray-700 text-gray-400 text-sm active:bg-gray-600 active:scale-95 transition-transform">−1 Alan</button>
        </div>
      </div>

      <ChangeHistory sport="squash" />
    </div>
  );
}

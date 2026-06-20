import { db, doc, increment, updateDoc } from '../lib/firebase';
import { logHistory } from '../lib/history';
import { usePingPong } from '../hooks/useScores';
import ChangeHistory from './ChangeHistory';
import type { Player } from '../types';

async function addPoint(player: Player) {
  await updateDoc(doc(db, 'scores', 'pingpong'), { [`fechas.${player}`]: increment(1) });
  await logHistory('pingpong', `+1 fecha para ${player}`);
}

async function removePoint(player: Player, current: number) {
  if (current <= 0) return;
  await updateDoc(doc(db, 'scores', 'pingpong'), { [`fechas.${player}`]: increment(-1) });
  await logHistory('pingpong', `-1 fecha para ${player}`);
}

export default function PingPong() {
  const data = usePingPong();
  const total = data.fechas.nico + data.fechas.alan;
  const leader =
    data.fechas.nico > data.fechas.alan ? 'Nico lidera'
    : data.fechas.alan > data.fechas.nico ? 'Alan lidera'
    : 'Empate';

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center text-pink-400 drop-shadow">🏓 Ping Pong</h1>

      <div className="bg-black/45 backdrop-blur-md rounded-2xl p-6 space-y-3 border border-white/10">
        <h2 className="text-xs text-green-500/60 uppercase tracking-widest text-center">Fechas ganadas</h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-6xl font-black text-green-400 drop-shadow">{data.fechas.nico}</div>
            <div className="text-sm text-gray-300">Nico</div>
          </div>
          <div className="text-white/20 text-3xl">—</div>
          <div className="text-center">
            <div className="text-6xl font-black text-amber-400 drop-shadow">{data.fechas.alan}</div>
            <div className="text-sm text-gray-300">Alan</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400">{leader} · {total} fechas jugadas</div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => addPoint('nico')} className="w-full py-4 rounded-2xl bg-green-400 text-black font-bold text-lg active:scale-95 transition-transform hover:bg-green-300">+1 Nico</button>
          <button onClick={() => removePoint('nico', data.fechas.nico)} className="w-full py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 text-sm active:bg-black/60 active:scale-95 transition-transform">−1 Nico</button>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => addPoint('alan')} className="w-full py-4 rounded-2xl bg-amber-400 text-black font-bold text-lg active:scale-95 transition-transform hover:bg-amber-300">+1 Alan</button>
          <button onClick={() => removePoint('alan', data.fechas.alan)} className="w-full py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 text-sm active:bg-black/60 active:scale-95 transition-transform">−1 Alan</button>
        </div>
      </div>

      <ChangeHistory sport="pingpong" />
    </div>
  );
}

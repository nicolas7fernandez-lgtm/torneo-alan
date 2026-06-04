import { db, doc, increment, updateDoc } from '../lib/firebase';
import { usePingPong } from '../hooks/useScores';
import ScoreButton from './ScoreButton';
import type { Player } from '../types';

async function addPoint(player: Player) {
  await updateDoc(doc(db, 'scores', 'pingpong'), {
    [`fechas.${player}`]: increment(1),
  });
}

export default function PingPong() {
  const data = usePingPong();
  const total = data.fechas.nico + data.fechas.alan;
  const leader =
    data.fechas.nico > data.fechas.alan
      ? 'Nico lidera'
      : data.fechas.alan > data.fechas.nico
      ? 'Alan lidera'
      : 'Empate';

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center text-pink-400">🏓 Ping Pong</h1>

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
        <div className="text-center text-xs text-gray-500">{leader} · {total} fechas jugadas</div>
      </div>

      <div className="flex gap-3">
        <ScoreButton label="+1 Nico" onClick={() => addPoint('nico')} color="blue" />
        <ScoreButton label="+1 Alan" onClick={() => addPoint('alan')} color="red" />
      </div>
    </div>
  );
}

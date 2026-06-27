import { db, doc, updateDoc, increment } from '../lib/firebase';
import { logHistory } from '../lib/history';
import { useSquash } from '../hooks/useScores';
import { playScoreSound } from '../hooks/useScoreSound';
import ChangeHistory from './ChangeHistory';
import type { Player } from '../types';

const FECHAS_PER_TORNEO = 10;

async function addPoint(player: Player, data: ReturnType<typeof useSquash>) {
  playScoreSound(player);
  const ref = doc(db, 'scores', 'squash');
  const newFechas = { ...data.fechas, [player]: data.fechas[player] + 1 };
  const newTorneos = { ...data.torneos };
  if (newFechas[player] >= FECHAS_PER_TORNEO) {
    newTorneos[player] += 1;
    newFechas.nico = 0;
    newFechas.alan = 0;
    await updateDoc(ref, { fechas: newFechas, torneos: newTorneos });
    await logHistory('squash', `+1 fecha para ${player} → torneo! ambos a 0`);
  } else {
    await updateDoc(ref, { fechas: newFechas });
    await logHistory('squash', `+1 fecha para ${player}`);
  }
}

async function removePoint(player: Player, data: ReturnType<typeof useSquash>) {
  if (data.fechas[player] <= 0) return;
  await updateDoc(doc(db, 'scores', 'squash'), { [`fechas.${player}`]: increment(-1) });
  await logHistory('squash', `-1 fecha para ${player}`);
}

async function removeTorneo(player: Player, data: ReturnType<typeof useSquash>) {
  if (data.torneos[player] <= 0) return;
  await updateDoc(doc(db, 'scores', 'squash'), { [`torneos.${player}`]: data.torneos[player] - 1 });
  await logHistory('squash', `-1 torneo para ${player}`);
}

export default function Squash() {
  const data = useSquash();

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center text-green-400 drop-shadow">🎾 Squash</h1>

      <div className="bg-black/45 backdrop-blur-md rounded-2xl p-4 space-y-2 border border-white/10">
        <h2 className="text-xs text-green-500/60 uppercase tracking-widest text-center">Torneos ganados</h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-5xl font-black text-violet-300 drop-shadow">{data.torneos.nico}</div>
            <div className="text-xs text-gray-300">Nico</div>
          </div>
          <div className="text-white/20 text-3xl">—</div>
          <div className="text-center">
            <div className="text-5xl font-black text-sky-300 drop-shadow">{data.torneos.alan}</div>
            <div className="text-xs text-gray-300">Alan</div>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={() => removeTorneo('nico', data)} className="flex-1 py-2 rounded-xl text-gray-300 text-sm bg-black/40 border border-white/10 active:bg-black/60 active:scale-95 transition-transform">−1 torneo Nico</button>
          <button onClick={() => removeTorneo('alan', data)} className="flex-1 py-2 rounded-xl text-gray-300 text-sm bg-black/40 border border-white/10 active:bg-black/60 active:scale-95 transition-transform">−1 torneo Alan</button>
        </div>
      </div>

      <div className="bg-black/45 backdrop-blur-md rounded-2xl p-6 space-y-3 border border-white/10">
        <h2 className="text-xs text-green-500/60 uppercase tracking-widest text-center">
          Fechas del ciclo actual (a {FECHAS_PER_TORNEO})
        </h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-6xl font-black text-violet-300 drop-shadow">{data.fechas.nico}</div>
            <div className="text-sm text-gray-300">Nico</div>
          </div>
          <div className="text-white/20 text-3xl">—</div>
          <div className="text-center">
            <div className="text-6xl font-black text-sky-300 drop-shadow">{data.fechas.alan}</div>
            <div className="text-sm text-gray-300">Alan</div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Nico</span><span>{data.fechas.nico}/{FECHAS_PER_TORNEO}</span></div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${(data.fechas.nico / FECHAS_PER_TORNEO) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Alan</span><span>{data.fechas.alan}/{FECHAS_PER_TORNEO}</span></div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${(data.fechas.alan / FECHAS_PER_TORNEO) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => addPoint('nico', data)} className="w-full py-4 rounded-2xl bg-violet-700 hover:bg-violet-600 text-white font-bold text-lg active:scale-95 transition-transform">+1 Nico</button>
          <button onClick={() => removePoint('nico', data)} className="w-full py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 text-sm active:bg-black/60 active:scale-95 transition-transform">−1 Nico</button>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => addPoint('alan', data)} className="w-full py-4 rounded-2xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-lg active:scale-95 transition-transform">+1 Alan</button>
          <button onClick={() => removePoint('alan', data)} className="w-full py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 text-sm active:bg-black/60 active:scale-95 transition-transform">−1 Alan</button>
        </div>
      </div>

      <ChangeHistory sport="squash" />
    </div>
  );
}

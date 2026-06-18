import { db, doc, updateDoc } from '../lib/firebase';
import { logHistory } from '../lib/history';
import { useAoe } from '../hooks/useScores';
import ChangeHistory from './ChangeHistory';
import type { Player } from '../types';

const FECHAS_PER_TORNEO = 50;

async function addPoint(player: Player, data: ReturnType<typeof useAoe>) {
  const ref = doc(db, 'scores', 'aoe');
  const newFechas = { ...data.fechas, [player]: data.fechas[player] + 1 };
  const newTorneos = { ...data.torneos };
  if (newFechas[player] >= FECHAS_PER_TORNEO) {
    newTorneos[player] += 1;
    newFechas.nico = 0;
    newFechas.alan = 0;
    await updateDoc(ref, { fechas: newFechas, torneos: newTorneos });
    await logHistory('aoe', `+1 fecha para ${player} → torneo! ambos a 0`);
  } else {
    await updateDoc(ref, { fechas: newFechas, torneos: newTorneos });
    await logHistory('aoe', `+1 fecha para ${player}`);
  }
}

async function removePoint(player: Player, data: ReturnType<typeof useAoe>) {
  if (data.fechas[player] <= 0) return;
  await updateDoc(doc(db, 'scores', 'aoe'), {
    [`fechas.${player}`]: data.fechas[player] - 1,
  });
  await logHistory('aoe', `-1 fecha para ${player}`);
}

async function removeTorneo(player: Player, data: ReturnType<typeof useAoe>) {
  if (data.torneos[player] <= 0) return;
  await updateDoc(doc(db, 'scores', 'aoe'), {
    [`torneos.${player}`]: data.torneos[player] - 1,
  });
  await logHistory('aoe', `-1 torneo para ${player}`);
}

export default function AgeOfEmpires() {
  const data = useAoe();

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center text-yellow-400">⚔️ Age of Empires</h1>

      {/* Torneos ganados */}
      <div className="bg-gray-800 rounded-2xl p-4 space-y-2">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest text-center">Torneos ganados</h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-5xl font-black text-blue-400">{data.torneos.nico}</div>
            <div className="text-xs text-gray-400">Nico</div>
          </div>
          <div className="text-gray-600 text-3xl font-thin">—</div>
          <div className="text-center">
            <div className="text-5xl font-black text-red-400">{data.torneos.alan}</div>
            <div className="text-xs text-gray-400">Alan</div>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => removeTorneo('nico', data)}
            className="flex-1 py-2 rounded-xl text-gray-400 text-sm bg-gray-700 active:bg-gray-600 active:scale-95 transition-transform"
          >
            −1 torneo Nico
          </button>
          <button
            onClick={() => removeTorneo('alan', data)}
            className="flex-1 py-2 rounded-xl text-gray-400 text-sm bg-gray-700 active:bg-gray-600 active:scale-95 transition-transform"
          >
            −1 torneo Alan
          </button>
        </div>
      </div>

      {/* Fechas del ciclo actual */}
      <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest text-center">
          Fechas del ciclo actual (a {FECHAS_PER_TORNEO})
        </h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-5xl font-black text-blue-400">{data.fechas.nico}</div>
            <div className="text-xs text-blue-300 mt-0.5">{data.fechas.nico}/{FECHAS_PER_TORNEO}</div>
          </div>
          <div className="text-gray-600 text-3xl font-thin">—</div>
          <div className="text-center">
            <div className="text-5xl font-black text-red-400">{data.fechas.alan}</div>
            <div className="text-xs text-red-300 mt-0.5">{data.fechas.alan}/{FECHAS_PER_TORNEO}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Nico</span><span>{data.fechas.nico}/{FECHAS_PER_TORNEO}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(data.fechas.nico / FECHAS_PER_TORNEO) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Alan</span><span>{data.fechas.alan}/{FECHAS_PER_TORNEO}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(data.fechas.alan / FECHAS_PER_TORNEO) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Botones +1 / -1 fechas */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => addPoint('nico', data)} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg active:scale-95 transition-transform">+1 Nico</button>
          <button onClick={() => removePoint('nico', data)} className="w-full py-2 rounded-xl bg-gray-700 text-gray-400 text-sm active:bg-gray-600 active:scale-95 transition-transform">−1 Nico</button>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => addPoint('alan', data)} className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-lg active:scale-95 transition-transform">+1 Alan</button>
          <button onClick={() => removePoint('alan', data)} className="w-full py-2 rounded-xl bg-gray-700 text-gray-400 text-sm active:bg-gray-600 active:scale-95 transition-transform">−1 Alan</button>
        </div>
      </div>

      <ChangeHistory sport="aoe" />
    </div>
  );
}

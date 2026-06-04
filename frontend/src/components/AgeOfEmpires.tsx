import { db, doc, updateDoc } from '../lib/firebase';
import { useAoe } from '../hooks/useScores';
import type { Player } from '../types';

const FECHAS_PER_TORNEO = 50;

async function addPoint(player: Player, data: ReturnType<typeof useAoe>) {
  const ref = doc(db, 'scores', 'aoe');
  const newFechas = { ...data.fechas, [player]: data.fechas[player] + 1 };
  const newTorneos = { ...data.torneos };
  if (newFechas[player] % FECHAS_PER_TORNEO === 0) newTorneos[player] += 1;
  await updateDoc(ref, { fechas: newFechas, torneos: newTorneos });
}

async function removePoint(player: Player, data: ReturnType<typeof useAoe>) {
  if (data.fechas[player] <= 0) return;
  await updateDoc(doc(db, 'scores', 'aoe'), {
    [`fechas.${player}`]: data.fechas[player] - 1,
  });
}

export default function AgeOfEmpires() {
  const data = useAoe();
  const nicoProgress = data.fechas.nico % FECHAS_PER_TORNEO;
  const alanProgress = data.fechas.alan % FECHAS_PER_TORNEO;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center text-yellow-400">⚔️ Age of Empires</h1>

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
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest text-center">
          Fechas ({FECHAS_PER_TORNEO} = 1 torneo)
        </h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-5xl font-black text-blue-400">{data.fechas.nico}</div>
            <div className="text-xs text-gray-400">Nico total</div>
            <div className="text-xs text-blue-300 mt-0.5">{nicoProgress}/{FECHAS_PER_TORNEO} ciclo</div>
          </div>
          <div className="text-gray-600 text-3xl font-thin">—</div>
          <div className="text-center">
            <div className="text-5xl font-black text-red-400">{data.fechas.alan}</div>
            <div className="text-xs text-gray-400">Alan total</div>
            <div className="text-xs text-red-300 mt-0.5">{alanProgress}/{FECHAS_PER_TORNEO} ciclo</div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Nico</span><span>{nicoProgress}/{FECHAS_PER_TORNEO}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(nicoProgress / FECHAS_PER_TORNEO) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Alan</span><span>{alanProgress}/{FECHAS_PER_TORNEO}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(alanProgress / FECHAS_PER_TORNEO) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}

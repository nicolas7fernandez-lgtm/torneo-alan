import { db, doc, updateDoc } from '../lib/firebase';
import { useBasketball } from '../hooks/useScores';
import ScoreButton from './ScoreButton';
import type { Player } from '../types';

const FECHAS_PER_TORNEO = 7;

async function addFecha(player: Player, data: ReturnType<typeof useBasketball>) {
  const ref = doc(db, 'scores', 'basketball');
  const newFecha = { ...data.fechaActual, [player]: data.fechaActual[player] + 1 };
  const newTorneoActual = { ...data.torneoActual };
  const newTorneosPrevios = { ...data.torneosPrevios };

  if (newFecha[player] >= FECHAS_PER_TORNEO) {
    // Award torneo point
    newTorneosPrevios[player] += 1;
    newTorneoActual.nico = 0;
    newTorneoActual.alan = 0;
    newFecha.nico = 0;
    newFecha.alan = 0;
    newFecha.number += 1;
  } else {
    newTorneoActual[player] += 1;
    newFecha.number = data.fechaActual.number;
  }

  await updateDoc(ref, {
    fechaActual: newFecha,
    torneoActual: newTorneoActual,
    torneosPrevios: newTorneosPrevios,
  });
}

async function canjear(player: Player, data: ReturnType<typeof useBasketball>) {
  const ref = doc(db, 'scores', 'basketball');
  const unclaimed =
    data.torneosPrevios[player] -
    data.torneosPrevios[player === 'nico' ? 'nicoCanjados' : 'alanCanjados'];
  if (unclaimed <= 0) return;
  const key = player === 'nico' ? 'nicoCanjados' : 'alanCanjados';
  await updateDoc(ref, {
    [`torneosPrevios.${key}`]: data.torneosPrevios[key as 'nicoCanjados' | 'alanCanjados'] + 1,
  });
}

export default function Basketball() {
  const data = useBasketball();
  const tp = data.torneosPrevios;
  const nicoUnclaimed = tp.nico - tp.nicoCanjados;
  const alanUnclaimed = tp.alan - tp.alanCanjados;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center text-orange-400">🏀 Básquet</h1>

      {/* Torneos totales */}
      <div className="bg-gray-800 rounded-2xl p-4 space-y-2">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest text-center">Torneos ganados</h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-4xl font-black text-blue-400">{tp.nico}</div>
            <div className="text-xs text-gray-400">Nico</div>
            {tp.nicoCanjados > 0 && (
              <div className="text-xs text-green-500">{tp.nicoCanjados} canjeados</div>
            )}
            {nicoUnclaimed > 0 && (
              <button
                onClick={() => canjear('nico', data)}
                className="mt-1 text-xs bg-green-700 text-white px-2 py-0.5 rounded-full active:bg-green-800"
              >
                Canjear
              </button>
            )}
          </div>
          <div className="text-gray-600 text-2xl font-thin">—</div>
          <div className="text-center">
            <div className="text-4xl font-black text-red-400">{tp.alan}</div>
            <div className="text-xs text-gray-400">Alan</div>
            {tp.alanCanjados > 0 && (
              <div className="text-xs text-green-500">{tp.alanCanjados} canjeados</div>
            )}
            {alanUnclaimed > 0 && (
              <button
                onClick={() => canjear('alan', data)}
                className="mt-1 text-xs bg-green-700 text-white px-2 py-0.5 rounded-full active:bg-green-800"
              >
                Canjear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Torneo actual */}
      <div className="bg-gray-800 rounded-2xl p-4 space-y-2">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest text-center">
          Torneo actual (primero a {FECHAS_PER_TORNEO})
        </h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-5xl font-black text-blue-400">{data.torneoActual.nico}</div>
            <div className="text-xs text-gray-400">Nico</div>
          </div>
          <div className="text-gray-600 text-3xl font-thin">—</div>
          <div className="text-center">
            <div className="text-5xl font-black text-red-400">{data.torneoActual.alan}</div>
            <div className="text-xs text-gray-400">Alan</div>
          </div>
        </div>
      </div>

      {/* Fecha actual */}
      <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest text-center">
          Fecha {data.fechaActual.number}
        </h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400">{data.fechaActual.nico}</div>
            <div className="text-xs text-gray-400">Nico</div>
          </div>
          <div className="text-gray-600 text-2xl font-thin">—</div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-400">{data.fechaActual.alan}</div>
            <div className="text-xs text-gray-400">Alan</div>
          </div>
        </div>
        <div className="flex gap-3">
          <ScoreButton label="+1 Nico" onClick={() => addFecha('nico', data)} color="blue" />
          <ScoreButton label="+1 Alan" onClick={() => addFecha('alan', data)} color="red" />
        </div>
      </div>
    </div>
  );
}

import { db, doc, updateDoc } from '../lib/firebase';
import { logHistory } from '../lib/history';
import { useBasketball } from '../hooks/useScores';
import ChangeHistory from './ChangeHistory';
import type { Player } from '../types';

const PARTIDOS_PER_FECHA = 7;
const FECHAS_PER_TORNEO = 10;

async function addPartido(player: Player, data: ReturnType<typeof useBasketball>) {
  const ref = doc(db, 'scores', 'basketball');
  const newFecha = { ...data.fechaActual, [player]: data.fechaActual[player] + 1 };
  const newTorneoActual = { ...data.torneoActual };
  const newTorneosPrevios = { ...data.torneosPrevios };
  let action = `+1 partido para ${player}`;

  if (newFecha[player] >= PARTIDOS_PER_FECHA) {
    newTorneoActual[player] += 1;
    newFecha[player] = 0;
    action = `+1 partido para ${player} → fecha completada!`;
    if (newTorneoActual[player] >= FECHAS_PER_TORNEO) {
      newTorneosPrevios[player] += 1;
      newTorneoActual.nico = 0;
      newTorneoActual.alan = 0;
      action = `+1 partido para ${player} → torneo ganado!`;
    }
  }

  await updateDoc(ref, { fechaActual: newFecha, torneoActual: newTorneoActual, torneosPrevios: newTorneosPrevios });
  await logHistory('basketball', action);
}

async function removePartido(player: Player, data: ReturnType<typeof useBasketball>) {
  if (data.fechaActual[player] <= 0) return;
  await updateDoc(doc(db, 'scores', 'basketball'), { [`fechaActual.${player}`]: data.fechaActual[player] - 1 });
  await logHistory('basketball', `-1 partido para ${player}`);
}

async function removeFecha(player: Player, data: ReturnType<typeof useBasketball>) {
  if (data.torneoActual[player] <= 0) return;
  await updateDoc(doc(db, 'scores', 'basketball'), { [`torneoActual.${player}`]: data.torneoActual[player] - 1 });
  await logHistory('basketball', `-1 fecha para ${player}`);
}

async function canjear(player: Player, data: ReturnType<typeof useBasketball>) {
  const key = player === 'nico' ? 'nicoCanjados' : 'alanCanjados';
  if (data.torneosPrevios[player] - data.torneosPrevios[key] <= 0) return;
  await updateDoc(doc(db, 'scores', 'basketball'), { [`torneosPrevios.${key}`]: data.torneosPrevios[key] + 1 });
  await logHistory('basketball', `canjeó torneo de ${player}`);
}

function PlusMinusRow({ onPlus, onMinus, labelPlus, labelMinus, plusClass }: {
  onPlus: () => void; onMinus: () => void; labelPlus: string; labelMinus: string; plusClass: string;
}) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <button onClick={onPlus} className={`w-full py-4 rounded-2xl font-bold text-lg text-white active:scale-95 transition-transform ${plusClass}`}>{labelPlus}</button>
      <button onClick={onMinus} className="w-full py-2 rounded-xl text-gray-300 text-sm bg-black/40 border border-white/10 active:bg-black/60 active:scale-95 transition-transform">
        {labelMinus}
      </button>
    </div>
  );
}

export default function Basketball() {
  const data = useBasketball();
  const tp = data.torneosPrevios;
  const nicoUnclaimed = tp.nico - tp.nicoCanjados;
  const alanUnclaimed = tp.alan - tp.alanCanjados;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-center text-orange-400 drop-shadow">🏀 Básquet</h1>

      <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 space-y-2 border border-white/10">
        <h2 className="text-xs text-green-500/60 uppercase tracking-widest text-center">Torneos ganados</h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-4xl font-black text-violet-300 drop-shadow">{tp.nico}</div>
            <div className="text-xs text-gray-300">Nico</div>
            {tp.nicoCanjados > 0 && <div className="text-xs text-violet-400">{tp.nicoCanjados} canjeados</div>}
            {nicoUnclaimed > 0 && <button onClick={() => canjear('nico', data)} className="mt-1 text-xs bg-violet-900/60 text-violet-300 px-2 py-0.5 rounded-full border border-violet-700/40">Canjear</button>}
          </div>
          <div className="text-white/20 text-2xl">—</div>
          <div className="text-center">
            <div className="text-4xl font-black text-sky-300 drop-shadow">{tp.alan}</div>
            <div className="text-xs text-gray-300">Alan</div>
            {tp.alanCanjados > 0 && <div className="text-xs text-sky-400">{tp.alanCanjados} canjeados</div>}
            {alanUnclaimed > 0 && <button onClick={() => canjear('alan', data)} className="mt-1 text-xs bg-sky-900/60 text-sky-300 px-2 py-0.5 rounded-full border border-sky-700/40">Canjear</button>}
          </div>
        </div>
      </div>

      <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 space-y-2 border border-white/10">
        <h2 className="text-xs text-green-500/60 uppercase tracking-widest text-center">Fechas en torneo actual (a {FECHAS_PER_TORNEO})</h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-5xl font-black text-violet-300 drop-shadow">{data.torneoActual.nico}</div>
            <div className="text-xs text-gray-300">Nico</div>
          </div>
          <div className="text-white/20 text-3xl">—</div>
          <div className="text-center">
            <div className="text-5xl font-black text-sky-300 drop-shadow">{data.torneoActual.alan}</div>
            <div className="text-xs text-gray-300">Alan</div>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={() => removeFecha('nico', data)} className="flex-1 py-2 rounded-xl text-gray-300 text-sm bg-black/40 border border-white/10 active:bg-black/60">−1 fecha Nico</button>
          <button onClick={() => removeFecha('alan', data)} className="flex-1 py-2 rounded-xl text-gray-300 text-sm bg-black/40 border border-white/10 active:bg-black/60">−1 fecha Alan</button>
        </div>
      </div>

      <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 space-y-3 border border-white/10">
        <h2 className="text-xs text-green-500/60 uppercase tracking-widest text-center">Partidos en fecha actual (a {PARTIDOS_PER_FECHA})</h2>
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-violet-300 drop-shadow">{data.fechaActual.nico}</div>
            <div className="text-xs text-gray-300">Nico</div>
          </div>
          <div className="text-white/20 text-2xl">—</div>
          <div className="text-center">
            <div className="text-4xl font-bold text-sky-300 drop-shadow">{data.fechaActual.alan}</div>
            <div className="text-xs text-gray-300">Alan</div>
          </div>
        </div>
        <div className="flex gap-3">
          <PlusMinusRow onPlus={() => addPartido('nico', data)} onMinus={() => removePartido('nico', data)} labelPlus="+1 Nico" labelMinus="−1 Nico" plusClass="bg-violet-500 hover:bg-violet-400" />
          <PlusMinusRow onPlus={() => addPartido('alan', data)} onMinus={() => removePartido('alan', data)} labelPlus="+1 Alan" labelMinus="−1 Alan" plusClass="bg-sky-500 hover:bg-sky-400" />
        </div>
      </div>

      <ChangeHistory sport="basketball" />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useBasketball, useSquash, useAoe, usePingPong, useTodayActivity } from '../hooks/useScores';
import type { SportSummary } from '../hooks/useScores';
import TrendChart from './TrendChart';
import Quejas from './Quejas';

function formatNet(net: number): string {
  if (net > 0) return `+${net}`;
  if (net < 0) return `−${Math.abs(net)}`;
  return '';
}

function SportLine({ s }: { s: SportSummary }) {
  const parts: string[] = [];
  if (s.nicoNet !== 0) parts.push(`Nico ${formatNet(s.nicoNet)}`);
  if (s.alanNet !== 0) parts.push(`Alan ${formatNet(s.alanNet)}`);
  const summary = parts.length ? parts.join(', ') : 'actividad';
  return (
    <div className="text-xs flex items-center gap-1.5">
      <span>{s.emoji}</span>
      <span className="text-green-400/80 font-medium">{s.label}</span>
      <span className="text-white/20">·</span>
      <span className="text-gray-300">{summary}</span>
    </div>
  );
}

function SportCard({ emoji, name, nicoScore, alanScore, subtitle }: {
  emoji: string; name: string; nicoScore: number; alanScore: number; subtitle?: string;
}) {
  const nicoLeads = nicoScore > alanScore;
  const alanLeads = alanScore > nicoScore;
  return (
    <div className="bg-black/45 backdrop-blur-md rounded-2xl p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-semibold text-gray-200">{name}</span>
        {subtitle && <span className="text-xs text-green-500/50 ml-auto">{subtitle}</span>}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <div className={`text-3xl font-black drop-shadow ${nicoLeads ? 'text-green-400' : 'text-gray-300'}`}>{nicoScore}</div>
          <div className={`text-xs mt-0.5 ${nicoLeads ? 'text-green-400' : 'text-gray-300'}`}>{nicoLeads ? '👑 Nico' : 'Nico'}</div>
        </div>
        <div className="text-white/20 text-xl font-thin">—</div>
        <div className="text-center flex-1">
          <div className={`text-3xl font-black drop-shadow ${alanLeads ? 'text-sky-300' : 'text-gray-300'}`}>{alanScore}</div>
          <div className={`text-xs mt-0.5 ${alanLeads ? 'text-sky-300' : 'text-gray-300'}`}>{alanLeads ? '👑 Alan' : 'Alan'}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const bball = useBasketball();
  const squash = useSquash();
  const aoe = useAoe();
  const pp = usePingPong();
  const todayActivity = useTodayActivity();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const sports = [
    { nico: bball.torneosPrevios.nico, alan: bball.torneosPrevios.alan },
    { nico: squash.torneos.nico,       alan: squash.torneos.alan },
    { nico: aoe.torneos.nico,          alan: aoe.torneos.alan },
    { nico: pp.fechas.nico,            alan: pp.fechas.alan },
  ];

  const nicoWins = sports.filter(s => s.nico > s.alan).length;
  const alanWins = sports.filter(s => s.alan > s.nico).length;
  const champion = nicoWins > alanWins ? 'NICO' : alanWins > nicoWins ? 'ALAN' : null;
  const champColor = champion === 'NICO' ? 'text-green-400' : champion === 'ALAN' ? 'text-sky-300' : 'text-yellow-400';

  return (
    <div className="space-y-4 p-4">

      {/* Champion banner — merged with sport wins totals */}
      <div className="bg-black/50 backdrop-blur-md rounded-2xl p-5 border border-white/10">
        <div className="text-center">
          <div className="text-xs text-green-500/50 uppercase tracking-[0.2em] mb-2">The Chosen One</div>
          {champion ? (
            <>
              <div className="text-5xl mb-1">👑</div>
              <div className={`text-4xl font-black tracking-tight drop-shadow ${champColor}`}>{champion}</div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-1">🤝</div>
              <div className="text-3xl font-black text-yellow-400 drop-shadow">EMPATE</div>
            </>
          )}
        </div>

        {/* Sport wins side by side */}
        <div className="flex justify-around items-center mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-3xl font-black text-violet-300 drop-shadow">{nicoWins}</div>
            <div className="text-xs text-gray-400 mt-0.5">Nico</div>
            <div className="text-xs text-green-500/40">deportes ganados</div>
          </div>
          <div className="text-white/20 text-2xl">🏆</div>
          <div className="text-center">
            <div className="text-3xl font-black text-sky-300 drop-shadow">{alanWins}</div>
            <div className="text-xs text-gray-400 mt-0.5">Alan</div>
            <div className="text-xs text-sky-400/40">deportes ganados</div>
          </div>
        </div>

        {todayActivity.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 text-left space-y-1.5">
            <div className="text-xs text-green-500/50 uppercase tracking-widest">Hoy</div>
            {todayActivity.map(s => <SportLine key={s.sport} s={s} />)}
          </div>
        )}
      </div>

      <TrendChart />

      {/* Sport breakdown */}
      <div className="text-xs text-green-500/40 uppercase tracking-widest px-1">Desglose por deporte</div>

      <SportCard emoji="🏀" name="Básquet"        nicoScore={bball.torneosPrevios.nico} alanScore={bball.torneosPrevios.alan} subtitle="torneos" />
      <SportCard emoji="🎾" name="Squash"          nicoScore={squash.torneos.nico}       alanScore={squash.torneos.alan}       subtitle="torneos" />
      <SportCard emoji="⚔️" name="Age of Empires"  nicoScore={aoe.torneos.nico}          alanScore={aoe.torneos.alan}          subtitle={`torneos · ${aoe.fechas.nico}—${aoe.fechas.alan} fechas`} />
      <SportCard emoji="🏓" name="Ping Pong"       nicoScore={pp.fechas.nico}            alanScore={pp.fechas.alan}            subtitle="fechas" />

      <Quejas />
    </div>
  );
}

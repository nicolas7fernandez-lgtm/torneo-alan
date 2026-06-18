import { useEffect, useState } from 'react';
import { useBasketball, useSquash, useAoe, usePingPong, useLastActivity } from '../hooks/useScores';

function timeAgo(ts: { seconds: number } | null): string {
  if (!ts) return '...';
  const date = new Date(ts.seconds * 1000);
  const diff = Math.floor((Date.now() - ts.seconds * 1000) / 1000);
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`;
  const now = new Date();
  const hhmm = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === now.toDateString()) return `hoy a las ${hhmm}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `ayer a las ${hhmm}`;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm} a las ${hhmm}`;
}

function SportCard({
  emoji, name, nicoScore, alanScore, subtitle,
}: {
  emoji: string; name: string; nicoScore: number; alanScore: number; subtitle?: string;
}) {
  const nicoLeads = nicoScore > alanScore;
  const alanLeads = alanScore > nicoScore;
  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-semibold text-gray-300">{name}</span>
        {subtitle && <span className="text-xs text-gray-500 ml-auto">{subtitle}</span>}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <div className={`text-3xl font-black ${nicoLeads ? 'text-blue-400' : 'text-gray-500'}`}>{nicoScore}</div>
          <div className={`text-xs mt-0.5 ${nicoLeads ? 'text-blue-400' : 'text-gray-500'}`}>{nicoLeads ? '👑 Nico' : 'Nico'}</div>
        </div>
        <div className="text-gray-600 text-xl font-thin">—</div>
        <div className="text-center flex-1">
          <div className={`text-3xl font-black ${alanLeads ? 'text-red-400' : 'text-gray-500'}`}>{alanScore}</div>
          <div className={`text-xs mt-0.5 ${alanLeads ? 'text-red-400' : 'text-gray-500'}`}>{alanLeads ? '👑 Alan' : 'Alan'}</div>
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
  const lastActivity = useLastActivity();
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
  const champColor = champion === 'NICO' ? 'text-blue-400' : champion === 'ALAN' ? 'text-red-400' : 'text-yellow-400';

  return (
    <div className="space-y-4 p-4">
      {/* Champion banner */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-center border border-gray-700">
        <div className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-1">Campeón Indiscutido</div>
        {champion ? (
          <>
            <div className="text-5xl mb-1">👑</div>
            <div className={`text-4xl font-black tracking-tight ${champColor}`}>{champion}</div>
            <div className="text-xs text-gray-500 mt-2">
              lidera {nicoWins > alanWins ? nicoWins : alanWins} de {sports.length} deportes
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-1">🤝</div>
            <div className="text-3xl font-black text-yellow-400">EMPATE</div>
            <div className="text-xs text-gray-500 mt-2">{nicoWins} — {alanWins} deportes</div>
          </>
        )}

        {/* Last activity — below champion */}
        {lastActivity && (
          <div className="mt-4 pt-4 border-t border-gray-700 text-left space-y-0.5">
            <div className="text-xs text-gray-500 uppercase tracking-widest">Última actividad</div>
            <div className="text-xs text-gray-400">
              {timeAgo(lastActivity.timestamp)} · <span className="text-gray-300">{lastActivity.sportLabel}</span>
            </div>
            <div className="text-xs">
              <span className="text-orange-400 font-medium">{lastActivity.author}</span>
              <span className="text-gray-400"> {lastActivity.action}</span>
            </div>
          </div>
        )}
      </div>

      {/* Total trophies row */}
      <div className="bg-gray-800 rounded-2xl p-4 flex justify-around items-center">
        <div className="text-center">
          <div className="text-3xl font-black text-blue-400">{nicoWins}</div>
          <div className="text-xs text-gray-400">Nico</div>
          <div className="text-xs text-gray-500">deportes ganados</div>
        </div>
        <div className="text-gray-600 text-2xl">🏆</div>
        <div className="text-center">
          <div className="text-3xl font-black text-red-400">{alanWins}</div>
          <div className="text-xs text-gray-400">Alan</div>
          <div className="text-xs text-gray-500">deportes ganados</div>
        </div>
      </div>

      {/* Sport cards */}
      <SportCard emoji="🏀" name="Básquet" nicoScore={bball.torneosPrevios.nico} alanScore={bball.torneosPrevios.alan} subtitle="torneos" />
      <SportCard emoji="🎾" name="Squash" nicoScore={squash.torneos.nico} alanScore={squash.torneos.alan} subtitle="torneos" />
      <SportCard emoji="⚔️" name="Age of Empires" nicoScore={aoe.torneos.nico} alanScore={aoe.torneos.alan} subtitle={`torneos · ${aoe.fechas.nico}—${aoe.fechas.alan} fechas`} />
      <SportCard emoji="🏓" name="Ping Pong" nicoScore={pp.fechas.nico} alanScore={pp.fechas.alan} subtitle="fechas" />
    </div>
  );
}

import { useBasketball, useSquash, useAoe, usePingPong } from '../hooks/useScores';

function SportCard({
  emoji,
  name,
  nicoScore,
  alanScore,
  subtitle,
}: {
  emoji: string;
  name: string;
  nicoScore: number;
  alanScore: number;
  subtitle?: string;
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
          <div className={`text-3xl font-black ${nicoLeads ? 'text-blue-400' : 'text-gray-500'}`}>
            {nicoScore}
          </div>
          <div className={`text-xs mt-0.5 ${nicoLeads ? 'text-blue-400' : 'text-gray-500'}`}>
            {nicoLeads ? '👑 Nico' : 'Nico'}
          </div>
        </div>
        <div className="text-gray-600 text-xl font-thin">—</div>
        <div className="text-center flex-1">
          <div className={`text-3xl font-black ${alanLeads ? 'text-red-400' : 'text-gray-500'}`}>
            {alanScore}
          </div>
          <div className={`text-xs mt-0.5 ${alanLeads ? 'text-red-400' : 'text-gray-500'}`}>
            {alanLeads ? '👑 Alan' : 'Alan'}
          </div>
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

  // Points per sport: who leads each one
  const sports = [
    { nico: bball.torneosPrevios.nico, alan: bball.torneosPrevios.alan },
    { nico: squash.fechas.nico, alan: squash.fechas.alan },
    { nico: aoe.torneos.nico, alan: aoe.torneos.alan },
    { nico: pp.fechas.nico, alan: pp.fechas.alan },
  ];

  const nicoWins = sports.filter((s) => s.nico > s.alan).length;
  const alanWins = sports.filter((s) => s.alan > s.nico).length;

  const champion =
    nicoWins > alanWins ? 'NICO' : alanWins > nicoWins ? 'ALAN' : null;

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
            <div className="text-xs text-gray-500 mt-2">
              {nicoWins} — {alanWins} deportes
            </div>
          </>
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
      <SportCard
        emoji="🏀"
        name="Básquet"
        nicoScore={bball.torneosPrevios.nico}
        alanScore={bball.torneosPrevios.alan}
        subtitle="torneos"
      />
      <SportCard
        emoji="🎾"
        name="Squash"
        nicoScore={squash.fechas.nico}
        alanScore={squash.fechas.alan}
        subtitle="fechas"
      />
      <SportCard
        emoji="⚔️"
        name="Age of Empires"
        nicoScore={aoe.torneos.nico}
        alanScore={aoe.torneos.alan}
        subtitle={`torneos · ${aoe.fechas.nico}—${aoe.fechas.alan} fechas`}
      />
      <SportCard
        emoji="🏓"
        name="Ping Pong"
        nicoScore={pp.fechas.nico}
        alanScore={pp.fechas.alan}
        subtitle="fechas"
      />
    </div>
  );
}

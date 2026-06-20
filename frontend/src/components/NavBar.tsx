import type { Sport } from '../types';

interface Props {
  active: Sport;
  onChange: (s: Sport) => void;
}

const TABS: { id: Sport; label: string; emoji: string }[] = [
  { id: 'home', label: 'Inicio', emoji: '🏆' },
  { id: 'aoe', label: 'AoE', emoji: '⚔️' },
  { id: 'squash', label: 'Squash', emoji: '🎾' },
  { id: 'basketball', label: 'Básquet', emoji: '🏀' },
  { id: 'pingpong', label: 'Ping Pong', emoji: '🏓' },
];

export default function NavBar({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-black/85 backdrop-blur-md border-t border-green-900/40 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
              active === tab.id
                ? 'text-green-400'
                : 'text-gray-600 active:text-green-600'
            }`}
          >
            <span className="text-xl leading-none">{tab.emoji}</span>
            <span className="text-[9px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

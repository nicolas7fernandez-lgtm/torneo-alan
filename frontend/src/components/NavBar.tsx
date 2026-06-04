import type { Sport } from '../types';

interface Props {
  active: Sport;
  onChange: (s: Sport) => void;
}

const TABS: { id: Sport; label: string; emoji: string }[] = [
  { id: 'home', label: 'Inicio', emoji: '🏆' },
  { id: 'basketball', label: 'Básquet', emoji: '🏀' },
  { id: 'squash', label: 'Squash', emoji: '🎾' },
  { id: 'aoe', label: 'AoE', emoji: '⚔️' },
  { id: 'pingpong', label: 'Ping Pong', emoji: '🏓' },
];

export default function NavBar({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
              active === tab.id
                ? 'text-orange-400'
                : 'text-gray-500 active:text-gray-300'
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

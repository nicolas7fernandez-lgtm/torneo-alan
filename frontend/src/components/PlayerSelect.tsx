interface Props {
  onSelect: (player: 'nico' | 'alan') => void;
}

export default function PlayerSelect({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-10 px-8">
      <div className="text-center space-y-2">
        <div className="text-xs text-green-500/60 uppercase tracking-[0.25em]">The Chosen One</div>
        <div
          className="text-3xl font-black text-green-400"
          style={{ textShadow: '0 0 20px rgba(74,222,128,0.7)' }}
        >
          ¿Quién sos?
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => onSelect('nico')}
          className="w-full py-5 rounded-2xl bg-violet-700 hover:bg-violet-600 text-white text-xl font-black tracking-wide active:scale-95 transition-transform"
          style={{ boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
        >
          Nico
        </button>
        <button
          onClick={() => onSelect('alan')}
          className="w-full py-5 rounded-2xl bg-sky-700 hover:bg-sky-600 text-white text-xl font-black tracking-wide active:scale-95 transition-transform"
          style={{ boxShadow: '0 0 20px rgba(14,165,233,0.4)' }}
        >
          Alan
        </button>
      </div>
    </div>
  );
}

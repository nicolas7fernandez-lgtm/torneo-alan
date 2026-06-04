interface Props {
  label: string;
  onClick: () => void;
  color?: 'blue' | 'red';
  disabled?: boolean;
}

export default function ScoreButton({ label, onClick, color = 'blue', disabled }: Props) {
  const base =
    'flex-1 py-4 rounded-2xl text-white font-bold text-lg active:scale-95 transition-transform disabled:opacity-40';
  const colors = {
    blue: 'bg-blue-600 active:bg-blue-700',
    red: 'bg-red-600 active:bg-red-700',
  };
  return (
    <button className={`${base} ${colors[color]}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

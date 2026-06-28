import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTrendData } from '../hooks/useTrendData';

const RANGES = [
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: '6m',  days: 180 },
  { label: '1a',  days: 365 },
  { label: 'Max', days: null },
] as const;

function formatDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(d)}/${parseInt(m)}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const nico = payload.find((p: any) => p.dataKey === 'nico')?.value ?? 0;
  const alan = payload.find((p: any) => p.dataKey === 'alan')?.value ?? 0;
  return (
    <div className="bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs backdrop-blur">
      <div className="text-green-500/60 mb-1">{formatDate(label)}</div>
      <div className="text-violet-300">Nico {nico}</div>
      <div className="text-sky-300">Alan {alan}</div>
    </div>
  );
}

export default function TrendChart() {
  const [range, setRange] = useState<number | null>(30);
  const data = useTrendData(range);

  return (
    <div className="bg-black/45 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs text-green-500/60 uppercase tracking-widest">Tendencia general</h2>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button
              key={r.label}
              onClick={() => setRange(r.days ?? null)}
              className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                range === r.days
                  ? 'bg-green-700/70 text-green-200'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-gray-600 text-xs py-8">Sin datos en este rango</div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="nico"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#a78bfa' }}
            />
            <Line
              type="monotone"
              dataKey="alan"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#38bdf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-violet-400 inline-block rounded" />
          <span className="text-violet-300">Nico</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-sky-400 inline-block rounded" />
          <span className="text-sky-300">Alan</span>
        </span>
      </div>
    </div>
  );
}

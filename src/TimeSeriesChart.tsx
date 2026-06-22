import { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export type DataPoint = {
  date: string;
  cost: number;
  cpa: number;
  roi: number;
  conversions: number;
};

const SERIES = [
  { key: 'cost',        label: 'Cost',          color: '#EDE06B' },
  { key: 'cpa',         label: 'CPA',           color: '#4472C4' },
  { key: 'roi',         label: 'ROI confirmed', color: '#16A34A' },
  { key: 'conversions', label: 'Conversions',   color: '#A855F7' },
] as const;

type SeriesKey = (typeof SERIES)[number]['key'];

const LABEL: Record<SeriesKey, string> = Object.fromEntries(
  SERIES.map((s) => [s.key, s.label])
) as Record<SeriesKey, string>;

const COLOR: Record<SeriesKey, string> = Object.fromEntries(
  SERIES.map((s) => [s.key, s.color])
) as Record<SeriesKey, string>;

interface TooltipEntry {
  dataKey: string;
  value: number;
  color?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '11px 15px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
        minWidth: 215,
        fontFamily: 'inherit',
      }}
    >
      <p style={{ margin: '0 0 9px', fontSize: 13, color: '#9CA3AF', fontWeight: 400 }}>
        {label}.2026
      </p>
      {payload.map((entry) => {
        const key = entry.dataKey as SeriesKey;
        const color = COLOR[key] ?? entry.color ?? '#888';
        const label = LABEL[key] ?? key;
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 14, color: '#374151' }}>
              {label}:{' '}
              <strong style={{ fontWeight: 700 }}>{entry.value}</strong>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TrapBar({ x, y, width, height, fill }: { x?: number; y?: number; width?: number; height?: number; fill?: string }) {
  if (x == null || y == null || !width || height == null || height <= 0) return null;
  const inset = Math.min(5, width * 0.12);
  const fillPath = `M ${x},${y + height} L ${x + inset},${y} L ${x + width - inset},${y} L ${x + width},${y + height} Z`;
  const borderPath = `M ${x},${y + height} L ${x + inset},${y} L ${x + width - inset},${y} L ${x + width},${y + height}`;
  return (
    <g>
      <path d={fillPath} fill={fill} fillOpacity={0.85} />
      <path d={borderPath} stroke="#fff" strokeWidth={2} strokeOpacity={0.9} fill="none" strokeLinecap="round" />
    </g>
  );
}

function SquareDot({ cx, cy, fill }: { cx?: number; cy?: number; fill: string }) {
  if (cx == null || cy == null) return null;
  const s = 9;
  return <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} fill={fill} rx={1} />;
}

function SquareActiveDot({ cx, cy, fill }: { cx?: number; cy?: number; fill: string }) {
  if (cx == null || cy == null) return null;
  const s = 6;
  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill={fill} fillOpacity={0}>
        <animate attributeName="fill-opacity" from="0" to="0.22" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
        <animate attributeName="r" from="4" to="14" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
      </circle>
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} fill={fill} stroke="#fff" strokeWidth={2} rx={1} />
    </g>
  );
}

function DiamondActiveDot({ cx, cy, fill }: { cx?: number; cy?: number; fill: string }) {
  if (cx == null || cy == null) return null;
  const half = 1;
  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill={fill} fillOpacity={0}>
        <animate attributeName="fill-opacity" from="0" to="0.2" dur="0.35s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
        <animate attributeName="r" from="4" to="14" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
      </circle>
      <rect
        x={cx - half} y={cy - half}
        width={half * 2} height={half * 2}
        fill={fill} stroke="#fff" strokeWidth={0.4}
        transform={`rotate(45 ${cx} ${cy})`}
      />
    </g>
  );
}

const defaultData: DataPoint[] = [
  { date: '09.06', cost: 4,  cpa: 1.1,  roi: 530, conversions: 3  },
  { date: '10.06', cost: 22, cpa: 1.15, roi: 197, conversions: 25 },
  { date: '11.06', cost: 38, cpa: 1.5,  roi: 143, conversions: 24 },
  { date: '12.06', cost: 52, cpa: 1.2,  roi: 75,  conversions: 41 },
  { date: '13.06', cost: 60, cpa: 1.1,  roi: 280, conversions: 58 },
];

interface TimeSeriesChartProps {
  data?: DataPoint[];
  height?: number;
}

export function TimeSeriesChart({ data = defaultData, height = 320 }: TimeSeriesChartProps) {
  const [chartHovered, setChartHovered] = useState(false);
  return (
    <div
      style={{
        background: '#fce8ea',
        borderRadius: 16,
        padding: '20px 12px 12px 0',
        width: '100%',
      }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 0, left: 4 }}
          onMouseEnter={() => setChartHovered(true)}
          onMouseLeave={() => setChartHovered(false)}
        >
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#C9B8B8' }}
            axisLine={false}
            tickLine={false}
          />

          {/* Visible left axis — scaled to cost */}
          <YAxis
            yAxisId="cost"
            tick={{ fontSize: 11, fill: '#C9B8B8' }}
            axisLine={false}
            tickLine={false}
            width={38}
            tickCount={5}
            domain={[0, 70]}
          />
          <YAxis yAxisId="roi"         hide domain={[0, 680]} />
          <YAxis yAxisId="conversions" hide domain={[0, 86]}  />
          <YAxis yAxisId="cpa"         hide domain={[0, 60]}  />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1 }}
          />

          {/* Green line first — Area renders on top creating bright-inside effect */}
          <Line
            yAxisId="roi"
            type="monotone"
            dataKey="roi"
            stroke="#16A34A"
            strokeWidth={chartHovered ? 2.5 : 5}
            dot={false}
            activeDot={(props: any) => <DiamondActiveDot {...props} fill="#16A34A" />}
          />

          <Area
            yAxisId="cost"
            type="basis"
            dataKey="cost"
            fill="#FEF08A"
            fillOpacity={0.8}
            stroke="#EDE06B"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 5, fill: '#EDE06B', stroke: '#fff', strokeWidth: 2 }}
          />

          <Bar
            yAxisId="cpa"
            dataKey="cpa"
            fill="#4472C4"
            barSize={28}
            shape={(props: any) => <TrapBar {...props} />}
            isAnimationActive={false}
          />

          {/* Line — Conversions (purple), square dots always */}
          <Line
            yAxisId="conversions"
            type="linear"
            dataKey="conversions"
            stroke="#A855F7"
            strokeWidth={2}
            dot={(props: any) => <SquareDot {...props} fill="#A855F7" />}
            activeDot={(props: any) => <SquareActiveDot {...props} fill="#A855F7" />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

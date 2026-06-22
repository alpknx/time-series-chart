# TimeSeriesChart

Recharts-based composed chart with 4 data series: Cost (area), CPA (bars), ROI (spline), Conversions (line).

## Install

```bash
npm install
npm run dev
```

## Usage

```tsx
import { TimeSeriesChart, DataPoint } from './TimeSeriesChart'

const data: DataPoint[] = [
  { date: '09.06', cost: 4,  cpa: 1.1,  roi: 530, conversions: 3  },
  { date: '10.06', cost: 22, cpa: 1.15, roi: 197, conversions: 25 },
  { date: '11.06', cost: 38, cpa: 1.5,  roi: 143, conversions: 24 },
  { date: '12.06', cost: 52, cpa: 1.2,  roi: 75,  conversions: 41 },
  { date: '13.06', cost: 60, cpa: 1.1,  roi: 280, conversions: 58 },
]

<TimeSeriesChart data={data} height={320} />
```

## DataPoint fields

| Field | Type | Description |
|-------|------|-------------|
| `date` | `string` | X-axis label |
| `cost` | `number` | Yellow area (domain 0–70) |
| `cpa` | `number` | Blue trapezoid bars (domain 0–60) |
| `roi` | `number` | Dark green spline (domain 0–680) |
| `conversions` | `number` | Purple line with square dots (domain 0–86) |

Each series has its own hidden Y-axis — values are independent, all series scale to fill the chart.

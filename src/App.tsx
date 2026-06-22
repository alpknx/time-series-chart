import { TimeSeriesChart } from './TimeSeriesChart'
import type { DataPoint } from './TimeSeriesChart'
import './App.css'

const exampleData: DataPoint[] = [
  { date: '09.06', cost: 4,  cpa: 1.1,  roi: 530, conversions: 3  },
  { date: '10.06', cost: 22, cpa: 1.15, roi: 197, conversions: 25 },
  { date: '11.06', cost: 38, cpa: 1.5,  roi: 143, conversions: 24 },
  { date: '12.06', cost: 52, cpa: 1.2,  roi: 75,  conversions: 41 },
  { date: '13.06', cost: 60, cpa: 1.1,  roi: 280, conversions: 58 },
]

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 24, color: '#374151' }}>TimeSeriesChart</h2>
      <TimeSeriesChart data={exampleData} height={320} />
    </div>
  )
}

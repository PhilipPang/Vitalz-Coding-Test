import { Card, CardContent, CardHeader } from './ui/Card'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts'
import type { SleepPoint } from '../types/api'

export function SleepChart({ data }: { data: SleepPoint[] }) {
  const series = Array.isArray(data) ? data : []
  return (
    <Card>
      <CardHeader>
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-semibold">Sleep Trend</h3>
            <p className="text-xs text-gray-500">Total sleep hours per day</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {series.length ? (
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-15} height={40} interval={Math.ceil(series.length / 6)} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 'dataMax + 1']} />
                <Tooltip />
                <Line type="monotone" dataKey="hours" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No chartable sleep data.</p>
        )}
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader } from './ui/Card'
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

export function ScoreGauge({ value }: { value: number | null }) {
  const v = value ?? 0
  const chartData = [{ name: 'VitalzScore', value: v, fill: 'currentColor' }]

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Score</h3>
        <p className="text-xs text-gray-500">Latest non-zero VitalzScore</p>
      </CardHeader>
      <CardContent>
        {value != null ? (
          <div className="h-64 text-black">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="65%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={12} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-36 text-center">
              <div className="text-4xl font-bold">{Math.round(v)}</div>
              <div className="text-xs text-gray-500 mt-1">out of 100</div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No score detected.</p>
        )}
      </CardContent>
    </Card>
  )
}

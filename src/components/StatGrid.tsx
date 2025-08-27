import { Card, CardContent } from './ui/Card'

export function StatGrid({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data)
  if (!entries.length) return <p className="text-sm text-gray-500">No stats for this date.</p>
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map(([k, v]) => (
        <Card key={k}>
          <CardContent>
            <div className="text-xs uppercase tracking-wide text-gray-500">{k}</div>
            <div className="mt-1 text-2xl font-semibold">{String(v)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

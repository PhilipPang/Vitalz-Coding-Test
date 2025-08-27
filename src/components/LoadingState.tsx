import { Skeleton } from './ui/Skeleton'

export function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Skeleton className="h-32" />
      <Skeleton className="h-64 sm:col-span-2" />
      <Skeleton className="h-64" />
      <Skeleton className="h-32" />
    </div>
  )
}

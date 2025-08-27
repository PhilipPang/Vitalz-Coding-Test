export function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100">
      {message}
    </div>
  )
}

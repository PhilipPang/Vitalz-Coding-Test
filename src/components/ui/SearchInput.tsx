import { cn } from '../../lib/utils'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string
}

export function SearchInput({ className, wrapperClassName, ...props }: Props) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
      >
        <path d="M13.5 12.5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <input
        type="text"
        className={cn('w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300', className)}
        {...props}
      />
    </div>
  )
}

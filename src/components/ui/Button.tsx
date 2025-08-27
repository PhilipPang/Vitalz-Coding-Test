import { cn } from '../../lib/utils'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>
export function Button({ className, ...props }: Props) {
  return (
    <button
      className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-50', className)}
      {...props}
    />
  )
}

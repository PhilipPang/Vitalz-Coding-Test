import { useEffect, useMemo, useRef, useState } from 'react'
import type { UserIdentity } from '../types/api'
import { cn } from '../lib/utils'

function normalize(s?: string) { return (s ?? '').toLowerCase().trim() }
function matchUser(u: UserIdentity, q: string) {
  const n = normalize(q)
  if (!n) return true
  return [u.email, u.name, u.company, u.loginEmail].some(v => normalize(v).includes(n))
}

export function SearchUsers({ users, companyFilter, onSelect }: {
  users: UserIdentity[]
  companyFilter?: string
  onSelect: (user: UserIdentity) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const list = companyFilter ? users.filter(u => normalize(u.company) === normalize(companyFilter)) : users
    const hits = list.filter(u => matchUser(u, query))
    return hits.slice(0, 8)
  }, [users, companyFilter, query])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key.length === 1 || e.key === 'Backspace')) setOpen(true)
    if (!filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter') {
      e.preventDefault()
      const u = filtered[active]
      if (u) { onSelect(u); setOpen(false); setQuery('') }
    }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="space-y-2" ref={wrapRef}>
      <label className="text-sm font-medium">Search users</label>
      <div className="relative">
        {/* search icon */}
        <svg aria-hidden viewBox="0 0 20 20" fill="none"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400">
          <path d="M13.5 12.5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          type="text"
          placeholder="Search by email, username, or device company…"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onKeyDown={handleKey}
          className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* dropdown */}
        {open && query && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-soft max-h-72 overflow-auto">
            {filtered.length ? filtered.map((u, idx) => (
              <button
                key={`${u.loginEmail}::${u.deviceUserId}`}
                className={cn('w-full text-left px-3 py-2 text-sm hover:bg-gray-50', active === idx && 'bg-gray-50')}
                onMouseEnter={() => setActive(idx)}
                onClick={() => { onSelect(u); setOpen(false); setQuery('') }}
              >
                <div className="font-medium">{u.name || u.loginEmail}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{u.email || u.loginEmail}</span>
                  {u.company && <span className="badge">{u.company}</span>}
                </div>
              </button>
            )) : (
              <div className="px-3 py-2 text-sm text-gray-500">No results</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

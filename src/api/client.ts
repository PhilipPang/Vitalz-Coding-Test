const isDev = import.meta.env.DEV
const BASE = isDev ? '' : (import.meta.env.VITE_API_BASE ?? '') // force proxy in dev

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(path, BASE || window.location.origin)
  if (params) Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.append(k, String(v)))

  const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

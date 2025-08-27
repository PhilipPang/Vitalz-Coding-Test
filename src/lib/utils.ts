import { type ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function inferUserIdentity(item: Record<string, unknown>): {
  loginEmail?: string
  deviceUserId?: string
  label: string
} {
  const entries = Object.entries(item)
  const getStr = (keyPart: string) => entries.find(([k]) => k.toLowerCase().includes(keyPart))?.[1]

  const email = (getStr('email') || getStr('login')) as string | undefined
  const device = (getStr('deviceuserid') || getStr('device') || getStr('userid')) as string | number | undefined

  const label = String(getStr('name') || email || getStr('id') || 'User')

  return {
    loginEmail: email,
    deviceUserId: device != null ? String(device) : undefined,
    label,
  }
}

export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function numericEntries(obj: Record<string, unknown>) {
  return Object.entries(obj)
    .filter(([, v]) => typeof v === 'number')
    .sort((a, b) => Number(b[1]) - Number(a[1]))
}

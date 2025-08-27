import { useQuery } from '@tanstack/react-query'
import { VitalzAPI } from '../api/vitalz'
import type { GetUserListResponse, UserIdentity, GetSleepResponse, SleepPoint, GetScoreResponse, ScoreLatest, GetStaticsResponse, StaticsSummary } from '../types/api'

export function useUserList() {
  return useQuery({
    queryKey: ['users'],
    queryFn: VitalzAPI.listUsers,
    select: (raw: GetUserListResponse) => {
      const list = Array.isArray(raw?.data) ? raw.data : []
      return list.map((item) => {
        const loginEmail = (item.LoginEmail ?? '').toString().trim()
        const deviceUserId = (item.DeviceUserID ?? '').toString().trim()
        const name = (item.UserName ?? loginEmail ?? 'User').toString().trim()
        const company = (item.DeviceCompany ?? '').toString().trim() || undefined
        const label = company ? `${name} • ${company}` : name
        return { loginEmail, deviceUserId, label, company, name, email: loginEmail } as UserIdentity
      })
    },
  })
}

export function useUserData(user?: UserIdentity, dateISO?: string) {
  const enabled = Boolean(user?.loginEmail && user?.deviceUserId)

  const sleep = useQuery({
    queryKey: ['sleep', user?.loginEmail, user?.deviceUserId],
    queryFn: () => VitalzAPI.sleep(user!.loginEmail, user!.deviceUserId),
    enabled,
    select: (raw: GetSleepResponse): SleepPoint[] => {
      const rows = Array.isArray(raw?.data) ? raw.data : []
      return rows
        .filter(r => r.Date)
        .map(r => ({
          date: r.Date,
          hours: Number(r.TotalTimeAsleep ?? 0) / 3600,
          deepPct: Number(r.Deep ?? 0),
          lightPct: Number(r.Light ?? 0),
          awakePct: Number(r.Awake ?? 0),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
    }
  })

  const score = useQuery({
    queryKey: ['score', user?.loginEmail, user?.deviceUserId],
    queryFn: () => VitalzAPI.score(user!.loginEmail, user!.deviceUserId),
    enabled,
    select: (raw: GetScoreResponse): ScoreLatest | null => {
      const rows = Array.isArray(raw?.data) ? raw.data : []
      if (!rows.length) return null
      const sorted = rows.slice().sort((a, b) => b.Date.localeCompare(a.Date))
      const firstNonZero = sorted.find(r => Number(r.VitalzScore) > 0) ?? sorted[0]
      return { date: firstNonZero.Date, value: Number(firstNonZero.VitalzScore ?? 0) }
    }
  })

  const statics = useQuery({
    queryKey: ['statics', user?.loginEmail, user?.deviceUserId, dateISO],
    queryFn: () => VitalzAPI.statics(user!.loginEmail, user!.deviceUserId, dateISO!),
    enabled: enabled && Boolean(dateISO),
    select: (raw: GetStaticsResponse): StaticsSummary | null => {
      const rows = Array.isArray(raw?.data) ? raw.data : []
      if (!rows.length) return null
      const n = rows.length
      const sum = rows.reduce((acc, r) => {
        acc.hr += Number(r.HR ?? 0)
        acc.hrv += Number(r.HRV ?? 0)
        acc.spo2 += Number(r.OxygenSaturation ?? 0)
        return acc
      }, { hr: 0, hrv: 0, spo2: 0 })
      return {
        AvgHR: Math.round((sum.hr / n) * 10) / 10,
        AvgHRV: Math.round((sum.hrv / n) * 10) / 10,
        AvgOxygenSaturation: Math.round((sum.spo2 / n) * 10) / 10,
        Samples: n,
      }
    }
  })

  return { sleep, score, statics }
}

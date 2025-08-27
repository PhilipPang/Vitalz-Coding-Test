export type AnyObj = Record<string, unknown>

export type UserListItem = {
  ID: string
  LoginEmail: string
  UserName: string
  DeviceCompany?: string
  DeviceUserID: string
}

export type GetUserListResponse = {
  status: number
  data: UserListItem[]
}

export type SleepRow = {
  LoginEmail: string
  DeviceUserID: string
  Date: string
  SleepOnset: string
  WakeUpTime: string
  Awake: string
  Deep: string
  Light: string
  TotalTimeAsleep: string
}

export type GetSleepResponse = {
  status: number
  data: SleepRow[]
}

export type ScoreRow = {
  LoginEmail: string
  DeviceUserID: string
  Date: string
  VitalzScore: number
  ScoreType: string | null
}

export type GetScoreResponse = {
  status: number
  data: ScoreRow[]
}

export type StaticsRow = {
  LoginEmail: string
  DeviceUserID: string
  Date: string
  Time: string
  HR: number
  HRV: number
  OxygenSaturation: number
}

export type GetStaticsResponse = {
  status: number
  data: StaticsRow[]
}

export type UserIdentity = {
  loginEmail: string
  deviceUserId: string
  label: string
  company?: string
  name?: string
  email?: string
}

// Transformed shapes for UI
export type SleepPoint = { date: string; hours: number; deepPct: number; lightPct: number; awakePct: number }
export type ScoreLatest = { date: string; value: number }
export type StaticsSummary = { AvgHR: number; AvgHRV: number; AvgOxygenSaturation: number; Samples: number }

import { apiGet } from './client'
import type { GetUserListResponse, GetSleepResponse, GetScoreResponse, GetStaticsResponse } from '../types/api'

export const VitalzAPI = {
  listUsers: () => apiGet<GetUserListResponse>('/api/getUserList'),
  sleep: (LoginEmail: string, DeviceUserID: string) =>
    apiGet<GetSleepResponse>('/api/getUserSleepData', { LoginEmail, DeviceUserID }),
  score: (LoginEmail: string, DeviceUserID: string) =>
    apiGet<GetScoreResponse>('/api/getUserScore', { LoginEmail, DeviceUserID }),
  statics: (LoginEmail: string, DeviceUserID: string, Date: string) =>
    apiGet<GetStaticsResponse>('/api/getUserStatics', { LoginEmail, DeviceUserID, Date }),
}

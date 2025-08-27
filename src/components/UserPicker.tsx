import { Select } from './ui/Select'
import type { UserIdentity } from '../types/api'

export function UserPicker({ users, value, onChange }: { users: UserIdentity[]; value?: string; onChange: (id: string) => void }) {
  const options = users.map((u, i) => ({ label: u.label || u.loginEmail || `User ${i+1}`, value: `${u.loginEmail}::${u.deviceUserId}` }))
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">User</label>
      <Select options={options} value={value} onChange={onChange} />
      <p className="text-xs text-gray-500">Choose a user to load sleep, score and daily statistics.</p>
    </div>
  )
}

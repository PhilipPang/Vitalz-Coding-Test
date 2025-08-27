import { useMemo, useState } from 'react'
import { useUserList, useUserData } from '../hooks/useVitalz'
import { toISODate } from '../lib/utils'
import { UserPicker } from '../components/UserPicker'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatGrid } from '../components/StatGrid'
import { SleepChart } from '../components/SleepChart'
import { ScoreGauge } from '../components/ScoreGauge'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { Select } from '../components/ui/Select'
import { SearchUsers } from '../components/SearchUsers'
import type { UserIdentity } from '../types/api'

function normalize(s?: string) { return (s ?? '').toLowerCase().trim() }

export function Dashboard() {
  const [selected, setSelected] = useState<string>('')
  const [date, setDate] = useState<string>(toISODate(new Date()))
  const [company, setCompany] = useState<string>('')

  const usersQ = useUserList()

  // Companies list
  const companies = useMemo(() => {
    const users = usersQ.data ?? []
    return Array.from(new Set(users.map(u => u.company).filter(Boolean))) as string[]
  }, [usersQ.data])

  // Users shown in the picker respect the company filter (but NOT search)
  const usersForPicker = useMemo(() => {
    const users = usersQ.data ?? []
    if (!company) return users
    return users.filter(u => normalize(u.company) === normalize(company))
  }, [usersQ.data, company])

  const currentUser = useMemo(() => {
    if (!selected) return undefined
    const [loginEmail, deviceUserId] = selected.split('::')
    return { loginEmail, deviceUserId, label: loginEmail }
  }, [selected])

  const { sleep, score, statics } = useUserData(currentUser, date)

  function handleSelectUser(u: UserIdentity) {
    setSelected(`${u.loginEmail}::${u.deviceUserId}`)
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4">
        {/* SEARCH (live dropdown) */}
        <SearchUsers users={usersQ.data ?? []} companyFilter={company} onSelect={handleSelectUser} />

        {/* User, Date, Company filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <UserPicker
              users={usersForPicker as UserIdentity[]}
              value={selected}
              onChange={setSelected}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <p className="text-xs text-gray-500">Daily statistics use this date.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Device Company</label>
            <Select
              options={[{ label: 'All companies', value: '' }, ...companies.map(c => ({ label: c, value: c }))]}
              value={company}
              onChange={setCompany}
            />
            <p className="text-xs text-gray-500">Filters the user list by device company.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => usersQ.refetch()} disabled={usersQ.isFetching}>Refresh Users</Button>
          {currentUser && (
            <>
              <Button onClick={() => sleep.refetch()} disabled={sleep.isFetching}>Refresh Sleep</Button>
              <Button onClick={() => score.refetch()} disabled={score.isFetching}>Refresh Score</Button>
              <Button onClick={() => statics.refetch()} disabled={statics.isFetching}>Refresh Statics</Button>
            </>
          )}
        </div>
      </section>

      <section>
        <Card>
          <CardContent>
            <div className="text-sm text-gray-600">Status</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li>Users: {usersQ.isLoading ? 'Loading…' : usersQ.isError ? 'Error' : usersQ.data?.length ?? 0} (picker filtered: {usersForPicker.length})</li>
              <li>Sleep: {sleep.fetchStatus === 'fetching' ? 'Loading…' : sleep.isError ? 'Error' : (sleep.data ? 'Loaded' : '—')}</li>
              <li>Score: {score.fetchStatus === 'fetching' ? 'Loading…' : score.isError ? 'Error' : (score.data ? 'Loaded' : '—')}</li>
              <li>Statics: {statics.fetchStatus === 'fetching' ? 'Loading…' : statics.isError ? 'Error' : (statics.data ? 'Loaded' : '—')}</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {usersQ.isError && <ErrorState message={(usersQ.error as Error).message} />}

      {currentUser ? (
        (sleep.isLoading || score.isLoading || statics.isLoading) ? (
          <LoadingState />
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {sleep.isError ? (
                <ErrorState message={(sleep.error as Error).message} />
              ) : (
                <SleepChart data={sleep.data ?? []} />
              )}
            </div>
            <div>
              {score.isError ? (
                <ErrorState message={(score.error as Error).message} />
              ) : (
                <ScoreGauge value={score.data?.value ?? null} />
              )}
            </div>

            <div className="lg:col-span-3">
              {statics.isError ? (
                <ErrorState message={(statics.error as Error).message} />
              ) : statics.data ? (
                <StatGrid data={statics.data as any} />
              ) : (
                <Card><CardContent>No daily statistics.</CardContent></Card>
              )}
            </div>
          </section>
        )
      ) : (
        <Card><CardContent>Select a user to load data.</CardContent></Card>
      )}
    </div>
  )
}

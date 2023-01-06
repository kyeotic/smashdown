import { useNavigate } from '@solidjs/router'
import { first } from 'lodash'
import {
  onMount,
  createResource,
  type Signal,
  Accessor,
  ResourceReturn,
} from 'solid-js'

import { Tournament } from './types'
import { TOURNAMENT } from '../root/routes'
import { useTournamentStore } from './context'
import db from '../db/local'
import toast from 'solid-toast'

//** App mount hook to load the latest unfinished tournament */
export function useTournamentInit() {
  const store = useTournamentStore()
  const navigate = useNavigate()

  onMount(async () => {
    const dbTournaments = await store.getPage()
    const latest = first(dbTournaments)
    if (latest && !latest.finishedOn) {
      navigate(TOURNAMENT(latest.id))
    }
  })
}

export function useTournaments(page = (() => 0) as Accessor<number>) {
  const store = useTournamentStore()
  const [tournaments] = createResource(page, async (p) =>
    store.getPage({ page: p }),
  )

  return [() => tournaments() ?? [], () => tournaments.loading] as const
}

export function useTournament(id: string) {
  const store = useTournamentStore()
  const [tournament, { mutate }] = createResource(id, async (_id) =>
    store.get(_id),
  )

  async function update(newValue: Tournament): Promise<void> {
    mutate(newValue)
    store.update(newValue).catch((e) => {
      toast.error(`Failed to update: ${e.message}`)
    })
  }

  return [tournament, update] as const
}

export function useTournamentsClassic() {
  const [tournaments] = createResource(async () => {
    const tournaments = await db.tournaments.getAll()
    return Object.values(tournaments)
  })

  return [() => tournaments() ?? [], () => tournaments.loading] as const
}

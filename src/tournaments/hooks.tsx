import { createResource, Accessor } from 'solid-js'

import { Tournament } from './types'
import { useTournamentDb } from './db'
import toast from 'solid-toast'

export function useTournaments(page = (() => 0) as Accessor<number>) {
  const db = useTournamentDb()
  const [tournaments] = createResource(page, async (p) =>
    db.getPage({ page: p }),
  )

  return [() => tournaments() ?? [], () => tournaments.loading] as const
}

export function useTournament(id: string) {
  const db = useTournamentDb()
  const [tournament, { mutate }] = createResource(id, async (_id) =>
    db.get(_id),
  )

  async function update(newValue: Tournament): Promise<void> {
    mutate(newValue)
    db.update(newValue).catch((e) => {
      toast.error(`Failed to update: ${e.message}`)
    })
  }

  return [tournament, update] as const
}

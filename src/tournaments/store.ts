import { createResource, type Signal } from 'solid-js'
import { createStore, reconcile, unwrap } from 'solid-js/store'

import db from '../db/local'
import { Tournament } from './types'

export function useTournaments() {
  const [tournaments] = createResource(async () => {
    const tournaments = await db.tournaments.getAll()
    return Object.values(tournaments)
  })

  return [() => tournaments() ?? [], tournaments.loading] as const
}

export function useTournament(id: string) {
  return createResource(
    id,
    async (_id) => {
      return db.tournaments.get(_id)
    },
    {
      storage: createTournamentStorage,
    },
  )
}

function createTournamentStorage<T>(value: T): Signal<T> {
  const [store, setStore] = createStore({
    value,
  })
  return [
    () => store.value,
    (v: T) => {
      const unwrapped = unwrap(store.value)
      typeof v === 'function' && (v = v(unwrapped))
      setStore('value', reconcile(v))
      db.tournaments.save(store.value as Tournament).catch((e) => {
        console.error('Error saving Tournament in Storage', e)
      })
      return store.value
    },
  ] as Signal<T>
}

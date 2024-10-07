import { Tournament } from './types'
import { createStore, Store, type SetStoreFunction } from 'solid-js/store'
import { TournamentDb } from './db'
import { withRollback } from '../db/store'
import { ReactiveMap } from '@solid-primitives/map'
import { batch } from 'solid-js'
import { first } from 'lodash'

/*
  Describe the relationship between the store, its signals, and its consumers

  - The store provides direct, read-only access to signals
  - consumers read from signals, but do not write
  - the store keeps a private reference to the signal setter-function
  - the store provides write methods that make use of the private signal setter
  - the's writer methods ALSO update the api-db
    - the writers methods must therefore be async
    - the writer methods should optimistically update the signals IF it can undo the write when the API call fails
    - the writer methods should update the signals after API success IF it cannot easily undo the write when the API call fails
  

There are a few ways we can handle undo

- solid-undo-redo, which keeps a list
  - PRO: history list is linear
  - PRO: history is observable
  - CON: linear history cannot undo any commit except the last, so it can't undo -2 and leave -1
- each operation keeps a copy of the previous state, but only the part that it is updating.
  - PRO: memory is freed as soon as the operation commits, or after a delay to keep a short undo
  - PRO: undo can come after other operations, allowing undo action -2 while leaving action -1
  - CON: history is local, observing may be difficult.
  - CON: undo might result in REDOING a different undo if there is overlap, since it kept state that was updated but undone


I think the later option is better

How this this be made easily re-usable?

Create a function that takes in
- the current state
- the async fn that update the state

There are three options for error handling
1. the function is async and can be caught normally. This requires the caller to handle errors
2. the function could return an object with an `onError` function that adds a handler. This allows the caller to not handle the error, relying on automatic rollback to handle errors.
3. the function is async and can be caught normally, with a parameter to catch errors internally and not throw anything, giving normal async ergonomics with optional error handling


I think the lost option is best. I have implemented it in : db/store/withRollback

*/

export type Tournaments = { [key: string]: Tournament }
interface TournamentSignalStore {
  tournaments: ReactiveMap<string, Tournament>
  lastPageLoaded: number
  isLoading: boolean
}

export class TournamentStore {
  private store: Store<TournamentSignalStore>
  private setStore: SetStoreFunction<TournamentSignalStore>

  constructor(private db: TournamentDb) {
    this.db = db

    const [store, setStore] = createStore({
      tournaments: new ReactiveMap<string, Tournament>(),
      lastPageLoaded: -1,
      isLoading: false,
    } as TournamentSignalStore)

    this.store = store
    this.setStore = setStore

    this.loadMore().catch(() => console.error('tournament store init failed'))
  }

  get tournaments() {
    return Array.from(this.store.tournaments.values()) as Tournament[]
  }

  get lastPageLoaded() {
    return this.store.lastPageLoaded
  }

  get isLoading() {
    return this.store.isLoading
  }

  get latest() {
    const tournaments = this.tournaments
    return tournaments.reduce((latest, current) => {
      if (!latest) return current
      return latest?.createdOn < current.createdOn ? current : latest
    }, first(tournaments))
  }

  async loadMore(): Promise<void> {
    const nextPage = this.lastPageLoaded + 1
    this.setStore('isLoading', true)
    try {
      const page = await this.db.getPage({ page: nextPage })
      batch(() => {
        this.setStore({
          lastPageLoaded: nextPage,
          isLoading: false,
        })
        page.forEach((t) => this.store.tournaments.set(t.id, t))
      })
    } catch (e: any) {
      this.setStore('isLoading', false)
      console.error('next page loading', e)
    }
  }

  get(tournamentId: string): Tournament | null {
    return this.store.tournaments.get(tournamentId) ?? null
  }

  async create(tournament: Tournament): Promise<Tournament> {
    const result = await this.db.create(tournament)

    this.store.tournaments.set(result.id, result)

    return result
  }

  async update(tournament: Tournament): Promise<void> {
    const current = this.store.tournaments.get(tournament.id)
    if (!current) {
      throw Error('tournament not found, cannot update')
    }

    // try {
    //   this.store.tournaments.set(tournament.id, tournament)
    //   await this.db.update(tournament)
    // } catch (e: any) {
    //   this.store.tournaments.set(tournament.id, current)
    //   throw e
    // }

    withRollback(
      async () => {
        this.store.tournaments.set(tournament.id, tournament)
        await this.db.update(tournament)
      },
      async () => {
        this.store.tournaments.set(tournament.id, current)
      },
    )
  }

  async delete(tournamentId: string): Promise<void> {
    const current = this.store.tournaments.get(tournamentId)
    if (!current) {
      throw Error('tournament not found, cannot update')
    }

    withRollback(
      async () => {
        this.store.tournaments.delete(tournamentId)
        await this.db.delete(tournamentId)
      },
      async () => {
        this.store.tournaments.set(tournamentId, current)
      },
    )
  }
}

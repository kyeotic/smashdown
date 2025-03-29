import { batch } from 'solid-js'
import { ReactiveMap } from '@solid-primitives/map'
import { first, orderBy, sortBy } from 'lodash'
import { SignalStore } from '../data/signalStore'
import { TrpcAppClient } from '../data/trpc'

import { Tournament } from './types'
import { produce } from 'solid-js/store'
import { withRollback } from '../util/functions'
import { deserialize, serialize } from './model'
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

interface TournamentSignals {
  tournaments: Record<string, Tournament>
  lastPageLoaded: number
  isLoading: boolean
}

export class TournamentStore extends SignalStore<TournamentSignals> {
  // private _tournaments: ReactiveMap<string, Tournament>

  constructor(private trpc: TrpcAppClient) {
    super({
      tournaments: {},
      lastPageLoaded: -1,
      isLoading: true,
    })
    // this._tournaments = new ReactiveMap()

    // this.init().catch(() => console.error('tournament store init failed'))
  }

  async init() {
    await this.loadMore()
  }

  get tournaments(): Tournament[] {
    const items = orderBy(
      Object.values(this.store.tournaments) as Tournament[],
      // Object.values(this._tournaments) as Tournament[],
      'createdOn',
      'desc',
    )
    // console.log('items', items)
    return items
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
      const page = await this.trpc.tournaments.getAll.query()
      // console.log('page loaded', page)
      batch(() => {
        this.setStore(
          produce((store) => {
            store.lastPageLoaded = nextPage
            store.isLoading = false
            page.forEach((t) => {
              // this._tournaments.set(t.id, deserialize(t))
              store.tournaments[t.id] = deserialize(t)
            })
          }),
        )
      })
    } catch (e: any) {
      this.setStore('isLoading', false)
      console.error('next page loading', e)
    }
  }

  get(tournamentId: string): Tournament | null {
    // console.log('getting', tournamentId)
    return this.store.tournaments[tournamentId] ?? null
    // return this._tournaments.get(tournamentId) ?? null
  }

  private setTournament(tournament: Tournament) {
    this.setStore('tournaments', tournament.id, tournament)
    // this._tournaments.set(tournament.id, tournament)
  }

  async create(tournament: Tournament): Promise<Tournament> {
    const result = await this.trpc.tournaments.put.mutate(serialize(tournament))

    this.setTournament(tournament)

    return tournament
  }

  async update(tournament: Tournament): Promise<void> {
    const current = this.store.tournaments[tournament.id]
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
        this.setTournament(tournament)
        await this.trpc.tournaments.put.mutate(serialize(tournament))
      },
      async () => {
        this.setTournament(current)
      },
    )
  }

  async delete(tournamentId: string): Promise<void> {
    const current = this.store.tournaments[tournamentId]
    if (!current) {
      throw Error('tournament not found, cannot update')
    }

    withRollback(
      async () => {
        this.setStore(
          produce((store) => {
            delete store.tournaments[tournamentId]
          }),
        )
        // this._tournaments.delete(tournamentId)
        await this.trpc.tournaments.delete.mutate(tournamentId)
      },
      async () => {
        this.setTournament(current)
      },
    )
  }
}

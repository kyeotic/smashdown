import store from 'store2'
import { Tournament } from '../tournaments/types'
import {
  deserialize,
  serialize,
  type SerializedTournament,
} from '../tournaments/model'

const TOURNAMENT_KEY = 'TS'
const TOURNAMENT_NS = 'TS'
const DATE_PREFIX = '$$D:'

const tournaments = store.namespace(TOURNAMENT_NS)

const initial = tournaments.get(TOURNAMENT_KEY)

if (!initial) tournaments.set(TOURNAMENT_KEY, {})

type DbTournaments = { [key: string]: SerializedTournament }

const db = {
  tournaments: {
    getAll: async function (): Promise<{ [key: string]: Tournament }> {
      const all = tournaments.get(TOURNAMENT_KEY)
      return Object.fromEntries(
        Object.entries(all).map(([id, t]) => [
          id,
          deserialize(t as SerializedTournament),
        ]),
      )
    },
    getRaw: async function (): Promise<DbTournaments> {
      return tournaments.get(TOURNAMENT_KEY)
    },
    get: async function (id: string): Promise<Tournament | null> {
      const all = tournaments.get(TOURNAMENT_KEY)
      return all[id] ? deserialize(all[id]) : null
    },
    save: async function (tournament: Tournament) {
      tournaments.transact(TOURNAMENT_KEY, (tournaments) => {
        tournaments[tournament.id] = serialize(tournament)
        return tournaments
      })
    },
    // saveAll: async function (tourneys: Tournament[]) {
    //   tournaments.transact(TOURNAMENT_KEY, (tournaments) => {
    //     tourneys.forEach((t) => (tournaments[t.id] = serialize(t)))
    //     return tournaments
    //   })
    // },
    saveRaw: async function (tourneys: DbTournaments): Promise<void> {
      tournaments.set(TOURNAMENT_KEY, tourneys)
    },
    delete: async function (id: string) {
      tournaments.transact(TOURNAMENT_KEY, (tournaments) => {
        delete tournaments[id]
        return tournaments
      })
    },
  },
}

export default db

import store from 'store2'
import { Tournament } from '../tournaments/types'
import { deserialize, serialize } from '../tournaments/model'

const TOURNAMENT_KEY = 'TS'
const TOURNAMENT_NS = 'TS'
const DATE_PREFIX = '$$D:'

const tournaments = store.namespace(TOURNAMENT_NS)

const initial = tournaments.get(TOURNAMENT_KEY)

if (!initial) tournaments.set(TOURNAMENT_KEY, {})

// function replace(obj: any) {
//   if (Array.isArray(obj)) return obj
//   return Object.fromEntries(
//     Object.entries(obj).map(([key, value]) => {
//       if (value instanceof Date)
//         return [key, `${DATE_PREFIX}${value.getTime()}`]
//       return [key, value]
//     }),
//   )
// }

// store._.replace = (key, value) => {
//   if (typeof value === 'object') return replace(value)

//   return value
// }

// store._.revive = (key, value) => {
//   if (typeof value === 'string' && value.startsWith(DATE_PREFIX))
//     return new Date(parseFloat(value.replace(DATE_PREFIX, '')))
//   return value
// }

const db = {
  tournaments: {
    getAll: async function (): Promise<{ [key: string]: Tournament }> {
      const all = tournaments.get(TOURNAMENT_KEY)
      return Object.fromEntries(
        Object.entries(all).map(([id, t]) => [id, deserialize(t)]),
      )
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
    delete: async function (id: string) {
      tournaments.transact(TOURNAMENT_KEY, (tournaments) => {
        delete tournaments[id]
        return tournaments
      })
    },
  },
}

export default db

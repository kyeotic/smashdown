import { ulid, decodeTime, monotonicUlid } from 'jsr:@std/ulid'
import PlayerStore from '../players/playerStore.ts'
import TournamentStore from '../tournaments/tournamentStore.ts'
import UserStore from '../users/userStore.ts'
import { TournamentSchema } from '../tournaments/types.ts'
import { deleteEntireDb } from './kv.ts'
import { deserialize, serialize } from '../../client/tournaments/model.ts'
import { orderBy } from 'lodash'

const targetUrl =
  'https://api.deno.com/databases/1684a82f-d9b7-4db8-8376-38c869aea736/connect'
// const targetUrl = undefined

const userId = 'ILNVLmoFeKCzajH6uEjH9'

const kv = await Deno.openKv(targetUrl)
const store = new TournamentStore(kv)
const userStore = new UserStore(kv)

// await deleteEntireDb(kv)

await migrate()

async function migrate() {
  const user = (await userStore.getAll()).find((u) => u.id === userId)!

  console.log('user', user)
  const tourneys = orderBy(await store.getForUser(user.id), 'createdOn')
  // const test = ulid()
  // console.log('test', test, new Date())
  // console.log('decode', decodeTime(test), new Date(decodeTime(test)))
  // const base = new Date('2024-02-02')
  // console.log('old', ulid(base.getTime()))
  // console.log('reverse', new Date(decodeTime(ulid(base.getTime()))))

  for (const original of tourneys) {
    const next = {
      ...original,
      id: monotonicUlid(original.createdOn.getTime()),
    }

    console.log(
      'replace',
      original.id,
      next.id,
      new Date(decodeTime(next.id)),
      original.createdOn,
    )

    await store.delete(user.id, original.id)
    await store.put(user.id, next)
  }
}

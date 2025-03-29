import csv from 'npm:neat-csv@latest'
import PlayerStore from '../players/playerStore.ts'
import TournamentStore from '../tournaments/tournamentStore.ts'
import UserStore from '../users/userStore.ts'
import { TournamentSchema } from '../tournaments/types.ts'
import { deleteEntireDb } from './kv.ts'
import { deserialize, serialize } from '../../client/tournaments/model.ts'

// const targetUrl =
//   'https://api.deno.com/databases/1684a82f-d9b7-4db8-8376-38c869aea736/connect'
const targetUrl = undefined

const kv = await Deno.openKv(targetUrl)
const playerStore = new PlayerStore(kv)
const tourneyStore = new TournamentStore(kv)
const userStore = new UserStore(kv)

// await deleteEntireDb(kv)

const userMap = {
  // Local to AUth0 ID
  '7af8150d-8487-4db7-9dc7-fb12642e690b': 'ILNVLmoFeKCzajH6uEjH9',
}

const targetUser = '7af8150d-8487-4db7-9dc7-fb12642e690b'

await createUser()
await migrate()

async function createUser() {
  await userStore.create({
    id: 'ILNVLmoFeKCzajH6uEjH9',
    displayName: 'Kyeotic',
    externalIds: [
      { source: 'auth0-kyeotek', id: 'auth0|67da202a9ae3ba0e60ed8d9b' },
    ],
  })
}

async function migrate() {
  const playerFile = Deno.readTextFileSync(
    '/mnt/c/Users/kyeotic/Downloads/players_rows.csv',
  )

  const tournamentsFile = Deno.readTextFileSync(
    '/mnt/c/Users/kyeotic/Downloads/tournaments_rows.csv',
  )

  const playerData = await csv(playerFile)
  // const tournamentsData = await csv(tournamentsFile)
  const tournamentsData = JSON.parse(tournamentsFile)

  // console.log('content', tournamentsData)

  for (const player of playerData) {
    const mappedUser = userMap[player.user_id]
    // console.log('mappedUser', mappedUser, player.user_id)
    await playerStore.create(userMap[player.user_id], {
      id: player.id,
      name: player.name,
    })
  }

  console.log('count', tournamentsData.length)
  for (const tourney of tournamentsData) {
    // await
    console.log(tourney.id, tourney.created_at, tourney.data.createdOn)
    // console.log(tourney.data)
    const t = TournamentSchema.parse({
      ...tourney.data,
      updatedOn: tourney.updated_at,
    })

    // console.log(t)
    // console.log(t.createdOn, typeof t.createdOn)
    // break

    // console.log('parsed', t.id, !t.message)
    if (!!t.message) break
    await tourneyStore.put(userMap[tourney.user_id], t)

    // console.log(newT.createdOn, typeof newT.createdOn)

    // break
  }
}

import { unwrap } from 'solid-js/store'
import { Button, TextInput as Input } from '../components'
import { usePlayerStore } from '../players/context'
import { useTournamentStore } from '../tournaments/context'
import { keyBy, mapValues } from 'lodash'
import { FinishedRound } from '../tournaments/types'

export default function DataUtilities() {
  // const [tournaments, isLoading] = useTournamentsClassic()
  // const store = useTournamentStore()

  // async function importLocal() {
  //   if (isLoading()) return

  //   for (const [id, t] of Object.entries(tournaments()!)) {
  //     try {
  //       const n = await store.create(t)
  //       t.id = n.id
  //       await store.update(t)
  //       toast('import complete')
  //     } catch (e: any) {
  //       toast.error(e.message)
  //     }
  //   }
  // }

  const playerStore = usePlayerStore()
  const tourneyStore = useTournamentStore()

  async function migratePlayers() {
    const players = unwrap(playerStore.players)
    const tournaments = await tourneyStore.getPage()
    console.log('all tourneys', tournaments, players)
    if (players.length !== 2) {
      throw new Error('Players not loaded')
    }

    for (const tourney of tournaments) {
      const playerMap = mapValues(
        keyBy(tourney.players, 'id'),
        (t) => players.find((p) => p.name == t.name)?.id!,
      )

      const migrate = (id: string, label: string = 'none') => {
        if (!id || Object.values(playerMap).includes(id)) {
          console.log('already mapped', id)
          return id
        }
        console.log('mapping', label, id, playerMap[id])
        return playerMap[id]
      }

      tourney.players = tourney.players.map((p) => ({
        ...p,
        id: migrate(p.id, 'players'),
      }))

      tourney.rounds.forEach((r) => {
        r.players.forEach((p) => {
          p.player.id = migrate(p.player.id, 'round players')
        })

        const f = r as FinishedRound
        if (!f.finishedOn) return
        f.losers.forEach((f) => (f.id = migrate(f.id, 'loser')))
        f.winner.id = migrate(f.winner.id, 'winner')
      })

      tourneyStore.update(tourney)
    }

    // console.log('mapped', tournaments)
  }

  return (
    <div class="">
      <div class="flex gap-4 justify-start my-4">
        {/* <Button onClick={importLocal}>Import From Local</Button> */}
        <Button onClick={migratePlayers}>Migrate Players</Button>
      </div>
    </div>
  )
}

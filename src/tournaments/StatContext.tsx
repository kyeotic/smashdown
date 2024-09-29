import {
  createContext,
  type ParentProps,
  useContext,
  JSX,
  Accessor,
  createMemo,
} from 'solid-js'
import { useTournaments } from './hooks'
import { Fighter, FinishedRound, Player, Tournament } from './types'
import { round } from 'lodash'

export interface FighterStats {
  games: number
  wins: number
}
export interface PlayerStats {
  id: string
  record: {
    [fighterId: string]: FighterStats
  }
}

export type TournamentStats = Accessor<{
  [playerId: string]: PlayerStats
} | null>

export const StatProviderContext = createContext<TournamentStats>()

export function useStatContext(): TournamentStats {
  const ctx = useContext(StatProviderContext)

  if (!ctx)
    throw new Error(
      'useStatContext must be used within a StatProvider.Provider',
    )

  return ctx
}

export function StatProvider(
  props: ParentProps & { tournament: Tournament },
): JSX.Element {
  const [tournaments, isLoading] = useTournaments()
  const ctxStats = createMemo(() => {
    if (isLoading()) return null

    const playersStats = props.tournament.players.reduce((players, p) => {
      players[p.id] = {
        id: p.id,
        record: p.roster.reduce((stats, fighter) => {
          stats[fighter.id] = {
            games: 0,
            wins: 0,
          }
          return stats
        }, {} as { [fighterId: string]: FighterStats }),
      }
      return players
    }, {} as { [playerId: string]: PlayerStats })
    const playerIds = props.tournament.players.map((p) => p.id)

    console.log('roster stats', playersStats)
    console.log('all touns', tournaments(), playerIds)

    tournaments().forEach((tournament) => {
      console.log('stats tourn', tournament.id)
      if (!tournament.players.some((p) => playerIds.includes(p.id))) return

      const finishedRounds = tournament.rounds.filter(
        (r) => !!(r as FinishedRound).finishedOn,
      ) as FinishedRound[]

      for (let round of finishedRounds) {
        round.losers.forEach((l) => {
          const fighter = round.players.find((p) => p.player.id == l.id)!
          if (!playersStats[l.id]?.record[fighter?.fighter.id]) {
            return
          }
          playersStats[l.id].record[fighter?.fighter.id].games++
        })

        if (!playersStats[round.winner.id]) continue
        const fighter = round.players.find(
          (p) => p.player.id == round.winner.id,
        )!
        const stat = playersStats[round.winner.id].record[fighter?.fighter.id]
        if (!stat) continue
        stat.games++
        stat.wins++
      }
    })

    console.log('player sats', playersStats)

    return playersStats
  })

  return (
    <StatProviderContext.Provider value={ctxStats}>
      {props.children}
    </StatProviderContext.Provider>
  )
}

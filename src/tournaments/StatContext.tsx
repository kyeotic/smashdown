import {
  createContext,
  type ParentProps,
  useContext,
  JSX,
  Accessor,
  createMemo,
  createSignal,
  createEffect,
} from 'solid-js'
import { useTournaments } from './hooks'
import { FinishedRound, Tournament } from './types'
import { createStore, produce } from 'solid-js/store'
import { useTournamentStore } from './context'

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

export interface TournamentStats {
  [playerId: string]: PlayerStats
}

export const StatProviderContext = createContext<Accessor<TournamentStats>>()

export function useStatContext(): Accessor<TournamentStats>
export function useStatContext(
  allowMissing: boolean = false,
): Accessor<TournamentStats | undefined> {
  const ctx = useContext(StatProviderContext)

  if (!ctx) {
    if (allowMissing) return () => undefined
    throw new Error(
      'useStatContext must be used within a StatProvider.Provider',
    )
  }

  return ctx
}

export function StatProvider(
  props: ParentProps & { tournament: Tournament },
): JSX.Element {
  const store = useTournamentStore()

  const ctx = createMemo<TournamentStats>(() => {
    if (store.isLoading) return {}

    const playersStats = props.tournament.players.reduce(
      (players, p) => {
        players[p.id] = {
          id: p.id,
          record: p.roster.reduce(
            (stats, fighter) => {
              stats[fighter.id] = {
                games: 0,
                wins: 0,
              }
              return stats
            },
            {} as { [fighterId: string]: FighterStats },
          ),
        }
        return players
      },
      {} as { [playerId: string]: PlayerStats },
    )
    const playerIds = props.tournament.players.map((p) => p.id)

    store.tournaments.forEach((tournament) => {
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

    return playersStats
  })

  return (
    <StatProviderContext.Provider value={ctx}>
      {props.children}
    </StatProviderContext.Provider>
  )
}

import { nanoid } from 'nanoid'
import {
  Player,
  TournamentPlayer,
  Round,
  FinishedRound,
  Tournament,
  Fighter,
} from './types'
import { getFighter } from './roster'
import { parseJSON } from 'date-fns'
import { filter } from 'lodash'

export interface SerializedPlayer {
  id: string
  name: string
  roster: string[]
}

export interface SerializedTournament {
  id: string
  name: string
  createdOn: string
  startedOn?: string
  rosterSize: number
  players: Array<SerializedPlayer>
  rounds: Array<{
    players: Array<{
      playerId: string
      fighterId: string
    }>
    winnerId?: string
    loserIds?: string[]
    finishedOn?: string
  }>
  isComplete: boolean
  finishedOn?: string
  winnerId?: string
}

export function init(
  init: Partial<Omit<Tournament, 'finishedRounds' | 'unfinishedRounds'>> & {
    name: string
    players: Player[]
  },
): Tournament {
  return {
    id: init.id ?? nanoid(),
    name: init.name,
    createdOn: init.createdOn ?? new Date(),
    startedOn: init.startedOn,
    players: init.players,
    rosterSize: init.rosterSize ?? 10,
    rounds: init.rounds ?? [],
    isComplete: init.isComplete ?? false,
    finishedOn: init.finishedOn,
    winner: init.winner,
  }
}

export function serialize(t: Tournament): SerializedTournament {
  return {
    id: t.id,
    name: t.name,
    createdOn: t.createdOn.toISOString(),
    startedOn: t.startedOn?.toISOString(),
    finishedOn: t.finishedOn?.toISOString(),
    rosterSize: t.rosterSize,
    isComplete: t.isComplete,
    winnerId: t.winner?.id,
    players: t.players.map<SerializedTournament['players'][number]>((p) => ({
      id: p.id,
      name: p.name,
      roster: p.roster.map((r) => r.id),
    })),
    rounds: t.rounds.map<SerializedTournament['rounds'][number]>((r) => ({
      players: r.players.map<
        SerializedTournament['rounds'][number]['players'][number]
      >((p) => ({
        playerId: p.player.id,
        fighterId: p.fighter.id,
      })),
      winnerId: (r as FinishedRound).winner?.id,
      loserIds: (r as FinishedRound).losers?.map((l) => l.id),
      finishedOn: (r as FinishedRound).finishedOn?.toISOString(),
    })),
  }
}

export function deserialize(json: SerializedTournament): Tournament {
  const players = json.players.map<TournamentPlayer>((p) => ({
    ...p,
    roster: p.roster.map(getFighter),
  }))
  // function asPlayer()
  return init({
    id: json.id,
    name: json.name,
    createdOn: parseJSON(json.createdOn),
    startedOn: json.startedOn ? parseJSON(json.startedOn) : undefined,
    finishedOn: json.finishedOn ? parseJSON(json.finishedOn) : undefined,
    rosterSize: json.rosterSize,
    players,
    isComplete: json.isComplete,
    winner: json.winnerId
      ? players.find((p) => p.id === json.winnerId)
      : undefined,
    rounds: json.rounds.map<Round | FinishedRound>((r) => ({
      players: r.players.map<Round['players'][number]>((rr) => ({
        player: json.players.find((p) => p.id === rr.playerId)!,
        fighter: getFighter(rr.fighterId),
      })),
      winner: r.winnerId ? players.find((p) => p.id === r.winnerId) : undefined,
      losers: r.loserIds
        ? players.filter((p) => r.loserIds?.includes(p.id))
        : undefined,
      finishedOn: r.finishedOn ? parseJSON(r.finishedOn) : undefined,
    })),
  })
}

export function isFinished(round: Round): round is FinishedRound {
  return !!(round as FinishedRound).finishedOn
}

export function getFinishedRounds(t: Tournament): FinishedRound[] {
  return t.rounds.filter(
    (r) => (r as FinishedRound).finishedOn,
  ) as FinishedRound[]
}

export function getLostRoster(
  player: TournamentPlayer,
  tournament: Tournament,
): Fighter[] {
  return filter(player.roster, (f) =>
    getFinishedRounds(tournament).some(
      (r) =>
        r.losers.some((l) => l.id === player.id) &&
        r.players.find((p) => p.player.id === player.id)?.fighter.id === f.id,
    ),
  )
}

export function getNextFighter(
  player: TournamentPlayer,
  tournament: Tournament,
): Fighter {
  const lost = getLostRoster(player, tournament)
  const f = player.roster.find((f) => !lost.some((fi) => fi.id === f.id))
  if (!f) {
    console.log('lost', lost, player.roster)
    throw new Error('Tried to select a player with no roster left')
  }
  return f
}

export function hasFinished(t: Tournament): boolean {
  const losers = t.players.length - 1

  const lostPlayers = t.players.filter(
    (p) => getLostRoster(p, t).length === p.roster.length,
  ).length
  return losers === lostPlayers
}

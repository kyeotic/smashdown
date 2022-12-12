export interface Player {
  id: string
  name: string
}

export interface TournamentPlayer extends Player {
  roster: Fighter[]
}

export interface Fighter {
  id: string
  name: string
  isMii: boolean
  icon: string
}

export interface Round {
  players: Array<{ player: Player; fighter: Fighter }>
}

export interface FinishedRound extends Round {
  winner: Player
  losers: Player[]
  finishedOn: Date
}

export interface Tournament {
  id: string
  name: string
  createdOn: Date
  startedOn?: Date
  finishedOn?: Date
  rosterSize: number
  players: TournamentPlayer[]
  rounds: Round[]
  isComplete: boolean
  winner?: Player
}

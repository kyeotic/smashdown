import { type ParentProps } from 'solid-js'
import { optionalContext } from '../util/context'
import { Tournament, Round } from './types'

const { use: useTournament, Provider: TournamentProvider } = optionalContext(
  (props: ParentProps & { tournament: Tournament }) => props.tournament,
)
export { useTournament, TournamentProvider }

const { use: useRound, Provider: RoundProvider } = optionalContext(
  (props: ParentProps & { round: Round }) => props.round,
)
export { useRound, RoundProvider }

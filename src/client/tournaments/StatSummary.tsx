import { createMemo, JSX, Show } from 'solid-js'
import { FighterStats } from './StatContext'
import { bodyStyle } from '../components'
import { useRound, useTournament } from './context'
import { getFinishedRounds, isFinished } from './model'
import { last } from 'lodash'
import { unwrap } from 'solid-js/store'

export function StatSummary(props: { stats: FighterStats }): JSX.Element {
  const tournament = useTournament()
  const round = useRound()

  const isCurrentRound = createMemo(() => round && !isFinished(round))
  const winStreak = createMemo(() => {
    if (!tournament || !isCurrentRound()) return null
    const finished = getFinishedRounds(tournament)

    if (!finished.length) return null

    const previousWinner = last(finished)!.winner
    const previousWinnersFigher = last(finished)!.players.find(
      (p) => p.player.id === previousWinner.id,
    )?.fighter

    if (previousWinnersFigher?.id !== props.stats.id) return null

    return finished.filter((r) =>
      r.players.some((p) => p.fighter.id === props.stats.id),
    ).length
  })

  return (
    <Show when={props.stats}>
      {(s) => (
        <span class={bodyStyle('flex-0 text-md lg:text-xl font-medium')}>
          {s()?.wins}/{s()?.games} (
          {s()?.games === 0 ? 0 : ((s()?.wins / s()?.games) * 100).toFixed(2)}
          %)
          <Show when={winStreak()}>
            <span class="text-green-200"> +{winStreak()}</span>
          </Show>
        </span>
      )}
    </Show>
  )
}

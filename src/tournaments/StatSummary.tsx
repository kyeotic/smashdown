import { JSX, Show } from 'solid-js'
import { FighterStats } from './StatContext'

export function StatSummary(props: { stats: FighterStats }): JSX.Element {
  return (
    <Show when={props.stats}>
      {(s) => (
        <span class="flex-0 text-md lg:text-xl font-medium">
          {s()?.wins}/{s()?.games} (
          {s()?.games === 0 ? 0 : ((s()?.wins / s()?.games) * 100).toFixed(2)}
          %)
        </span>
      )}
    </Show>
  )
}

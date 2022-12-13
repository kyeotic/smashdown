import { For, mergeProps } from 'solid-js'
import classnames from 'classnames'
import { Fighter } from './types'
import FighterCard from './FighterCard'

const noopString = () => 'bg-slate-400'

export default function RosterList(props: {
  roster: Fighter[]
  fighterClass?: (f: Fighter) => string
  onSelect?: (fighter: Fighter) => void
}) {
  const merged = mergeProps({ fighterClass: noopString }, props)

  return (
    <div class="grid grid-cols-4 gap-4 max-w-xl">
      <For each={props.roster}>
        {(fighter) => (
          <FighterCard
            class={merged.fighterClass(fighter)}
            fighter={fighter}
            onClick={props.onSelect}
          />
        )}
      </For>
    </div>
  )
}

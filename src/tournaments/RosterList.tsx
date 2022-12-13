import { For, mergeProps } from 'solid-js'
import classnames from 'classnames'
import { Fighter } from './types'
import FighterCard from './FighterCard'

export default function RosterList(props: {
  roster: Fighter[]
  lost?: Fighter[]
  onSelect?: (fighter: Fighter) => void
}) {
  const merged = mergeProps({ lost: [] }, props)

  return (
    <div class="grid grid-cols-4 gap-4">
      <For each={props.roster}>
        {(fighter) => {
          const lost = merged.lost.some((l) => l.id === fighter.id)
            ? 'bg-red-400'
            : 'bg-slate-400'
          return (
            <FighterCard
              fighter={fighter}
              class={lost}
              onClick={props.onSelect}
            />
          )
        }}
      </For>
    </div>
  )
}

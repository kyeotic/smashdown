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
          return (
            <FighterCard
              fighter={fighter}
              lost={merged.lost.some((l) => l.id === fighter.id)}
              onClick={props.onSelect}
            />
          )
        }}
      </For>
    </div>
  )
}

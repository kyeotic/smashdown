import { type JSX, mergeProps, onMount, onCleanup } from 'solid-js'
import classnames from 'classnames'
import { Fighter } from './types'
import { max } from 'lodash'
import fitty from 'fitty'

import { noop } from '../util/functions'

function fitText(name: string): number {
  const scale = name.includes(' ') ? 0.009 : 0.009
  const longestSegment = max(name.split(' ').map((l) => l.length))
  // return 1 / (Math.max(longestSegment!, 7) * scale)
  return 12
}

export default function FighterCard(props: {
  class?: string
  fighter: Fighter
  onClick?: (f: Fighter) => void
}): JSX.Element {
  let name: HTMLElement | undefined
  const merged = mergeProps(
    { onClick: noop, lost: false, class: 'bg-slate-400' },
    props,
  )

  onMount(() => {
    const fit = fitty(name!)
    onCleanup(() => {
      fit.unsubscribe()
    })
  })

  return (
    <div
      class={classnames(
        merged.class,
        'p-2 rounded-md flex flex-col justify-center items-center',
      )}
      onclick={[merged.onClick, props.fighter]}
    >
      <div class="grow-0">
        <span
          ref={name}
          // style={{ 'font-size': fitText(props.fighter.name) + 'px' }}
          class="text-center text-ellipsis basis-4 grow-0 shrink-0 font-semibold "
        >
          {props.fighter.name}
        </span>
      </div>
      <img
        class="grow-0"
        src={`/images/smash-logos/${props.fighter.icon}`}
        alt={props.fighter.name}
      ></img>
    </div>
  )
}

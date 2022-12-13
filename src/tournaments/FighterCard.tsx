import { type JSX, mergeProps, createSignal, createEffect } from 'solid-js'
import classnames from 'classnames'
import { Fighter } from './types'
import { max } from 'lodash'

import { noop } from '../util/functions'
import { fighters } from './roster'

function fitText(name: string): number {
  const scale = name.includes(' ') ? 0.009 : 0.0078
  const longestSegment = max(name.split(' ').map((l) => l.length))
  return 1 / (Math.max(longestSegment!, 7) * scale)
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

  return (
    <div
      class={classnames(
        merged.class,
        'p-2 rounded-md flex flex-col justify-center',
      )}
      onclick={[merged.onClick, props.fighter]}
    >
      <span
        ref={name}
        style={{ 'font-size': fitText(props.fighter.name) + 'px' }}
        class={`text-center text-ellipsis basis-4 grow-0 shrink-0`}
      >
        {props.fighter.name}
      </span>
      <img
        class=""
        src={`/images/smash-logos/${props.fighter.icon}`}
        alt={props.fighter.name}
      ></img>
    </div>
  )
}

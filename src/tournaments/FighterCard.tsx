import { type JSX, mergeProps, createSignal, createEffect } from 'solid-js'
import classnames from 'classnames'
import { Fighter } from './types'

import { noop } from '../util/functions'
import { fighters } from './roster'

function useFit(name: string): number {
  return (1 / (name.length / 1.6)) * 55 * (name.includes(' ') ? 2 : 1)
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
        style={{ 'font-size': useFit(props.fighter.name) + 'px' }}
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

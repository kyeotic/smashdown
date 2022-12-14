import { type JSX, mergeProps } from 'solid-js'
import classnames from 'classnames'
import { Fighter } from './types'

import { noop } from '../util/functions'

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
        class="text-center text-ellipsis basis-4 grow-0 shrink-0 font-medium text-[12px] md:text-sm lg:text-2xl"
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

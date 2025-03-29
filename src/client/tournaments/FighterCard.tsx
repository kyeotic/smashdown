import { createMemo, createSignal, type JSX, mergeProps, Show } from 'solid-js'
import classnames from 'classnames'
import { Fighter } from './types'

import { noop } from '../util/functions'
import { usePlayer } from '../players/context'
import { useStatContext } from './StatContext'
import { StatSummary } from './StatSummary'

export default function FighterCard(props: {
  class?: string
  fighter: Fighter
  onClick?: (f: Fighter) => void
}): JSX.Element {
  let name: HTMLElement | undefined
  const player = usePlayer()
  const ctxStats = useStatContext(true)

  const [showStats, setShowStats] = createSignal<boolean>(false)
  const onclick =
    player!! && ctxStats()!!
      ? function onclick() {
          setShowStats((s) => !s)
        }
      : noop

  const merged = mergeProps(
    { onClick: onclick, lost: false, class: 'bg-slate-400' },
    props,
  )

  const stats = createMemo(() => {
    if (!player || !ctxStats()) return null
    return ctxStats()?.[player.id]?.record[props.fighter.id]
  })

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
        <Show when={!showStats()} fallback={<StatSummary stats={stats()!} />}>
          {props.fighter.name}
        </Show>
      </span>

      <img
        class=""
        src={`/images/smash-logos/${props.fighter.icon}`}
        alt={props.fighter.name}
      ></img>
    </div>
  )
}

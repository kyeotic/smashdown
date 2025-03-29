import { For, mergeProps, Show } from 'solid-js'
import { noop } from '../util/functions'
import { format } from 'date-fns'
import { A } from '@solidjs/router'

import { LabelItem } from '../components'

import type { Tournament } from './types'

export default function TournamentList(props: {
  tournaments: Tournament[]
  onSelect?: (tournament: Tournament) => void
}) {
  const merged = mergeProps({ onSelect: noop, tournaments: [] }, props)
  return (
    <div class="flex">
      <Show when={!merged.tournaments.length}>
        <span class="mt-4">No Tournaments</span>
      </Show>
      <div class="flex flex-col gap-4 mt-4">
        <For
          each={merged.tournaments.sort(
            (a, b) => b.createdOn.getTime() - a.createdOn.getTime(),
          )}
        >
          {(t) => {
            return (
              <A
                href={`/tournaments/${t.id}`}
                class="flex-auto flex flex-col items-center block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100"
                onclick={[merged.onSelect, t]}
              >
                <LabelItem label="Name" text={t.name} />
                <LabelItem
                  label="Created"
                  text={format(t.createdOn, 'dd MMMM yyyy')}
                />
                <Show when={t.winner}>
                  <LabelItem label="Winner" text={t.winner!.name} />
                </Show>
              </A>
            )
          }}
        </For>
      </div>
    </div>
  )
}

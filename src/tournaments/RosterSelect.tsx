import { Show, For, createSignal } from 'solid-js'
import { without, filter } from 'lodash'
import classnames from 'classnames'
import { fighters } from './roster'
import { Fighter } from './types'
import FighterCard from './FighterCard'

import { TextInput, Button, Label } from '../components'
import RosterList from './RosterList'

export default function RosterSelect(props: {
  hide?: Fighter[]
  onSubmit?: (fighters: Fighter[]) => void
  onCancel?: () => void
  allowMultiple?: boolean
}) {
  const [search, setSearch] = createSignal<string>('')
  const [selected, setSelected] = createSignal<Fighter[]>([])

  function isSelected(fighter: Fighter): boolean {
    return selected().includes(fighter)
  }

  function clear(fighter: Fighter) {
    setSelected(without(selected(), fighter))
  }

  function toggle(fighter: Fighter) {
    console.log('toggling', fighter.name)
    if (!isSelected(fighter)) {
      setSelected([...selected(), fighter])
    } else {
      clear(fighter)
    }
  }

  function clearAll() {
    setSelected([])
  }

  function submit() {
    props.onSubmit?.(selected())
  }

  const filterFighters = () =>
    filter(
      fighters,
      (f: Fighter) =>
        (!search || f.name.toLowerCase().includes(search().toLowerCase())) &&
        (props.hide?.every((_f) => _f.id !== f.id) ?? true),
    )

  return (
    <div>
      <Show when={selected().length}>
        <Label>Selected ({selected().length})</Label>
        <RosterList roster={selected()} onSelect={clear} />
        <div class="flex gap-4 justify-end mt-4">
          <Button class="" onclick={() => clearAll()}>
            Clear All
          </Button>
          <Button primary onclick={submit}>
            Submit
          </Button>
        </div>
      </Show>
      <TextInput
        label="Search By Name"
        class="mb-4"
        oninput={(e) => setSearch(e.currentTarget.value)}
      />
      <div class="grid grid-cols-4 gap-4">
        <For each={filterFighters()}>
          {(fighter) => (
            <FighterCard
              class={isSelected(fighter) ? 'bg-cyan-400' : 'bg-slate-400'}
              fighter={fighter}
              onClick={toggle}
            />
          )}
        </For>
      </div>
      <Button onclick={props.onCancel} class="mt-4">
        Cancel
      </Button>
    </div>
  )
}

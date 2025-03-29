import { Show, type JSX, createSignal, createMemo } from 'solid-js'
import { createFormGroup, createFormControl } from 'solid-forms'
import { useNavigate } from '@solidjs/router'

import { Select, createOptions } from '@thisbeyond/solid-select'

import { Button, H1, Label, PageLoader } from '../components'
import { TextInput } from '../components/Forms'
import { Player, Tournament, TournamentPlayer } from './types'
import { init } from './model'

import { useStores } from '../data/stores'
import { usePlayerStore } from '../players/context'

import '@thisbeyond/solid-select/style.css'

export default function NewTournamentsPage(): JSX.Element {
  const { tournaments: store } = useStores()
  return (
    <div class="p-8">
      <H1>New Tournament</H1>

      <Show when={!store.isLoading} fallback={<PageLoader />}>
        <NewTournament previous={store.latest} />
      </Show>
    </div>
  )
}

export function NewTournament(props: { previous?: Tournament }): JSX.Element {
  console.log('prev', props.previous)
  const { players: playerStore } = useStores()
  const [selectedPlayers, setPlayers] = createSignal<Player[]>(
    props.previous?.players?.map((p) => ({
      id: p.id,
      name: p.name,
    })) ?? [],
  )
  const availablePlayers = createMemo(() =>
    playerStore.players
      .filter((p) => !selectedPlayers().some((sp) => sp.id === p.id))
      .map((p) => ({ id: p.id, name: p.name })),
  )

  const { tournaments: store } = useStores()
  const navigate = useNavigate()
  const form = createFormGroup({
    name: createFormControl(''),
    rosterSize: createFormControl(
      props.previous ? props.previous.rosterSize.toString() : '10',
      {
        validators: [
          (raw: string) => {
            const val = parseFloat(raw)
            if (Number.isNaN(val)) return { isNotNumber: 'Must be a number' }
            if (!Number.isInteger(val))
              return { isNotInteger: 'Must be an integer' }
            if (val < 2 || val > 89)
              return { outOfRange: 'Must be between 2 and 89' }
            return null
          },
        ],
      },
    ),
  })

  async function submit(e: Event) {
    e.preventDefault()
    const name = form.value.name!
    const rosterSize = parseFloat(form.value.rosterSize!)
    const players = selectedPlayers().map(
      (t) =>
        ({
          id: t.id,
          name: t.name,
          roster: [],
        }) as TournamentPlayer,
    )

    const tournament = init({
      name,
      players,
      rosterSize,
    })
    const created = await store.create(tournament)

    navigate(`/tournaments/${created.id}`)
  }

  const selectProps = createOptions(availablePlayers, {
    // key: 'name',
    format: (item, type) => {
      return item.name
    },
  })

  return (
    <form onsubmit={submit}>
      <TextInput label="Tournament Name" control={form.controls.name} />
      <TextInput
        label="Roster Size"
        type="number"
        control={form.controls.rosterSize}
      />

      <div class="my-4 flex">
        <Label>Players</Label>
      </div>
      <Select
        onChange={setPlayers}
        multiple
        initialValue={selectedPlayers()}
        {...selectProps}
      />
      <Button type="submit" primary class="mt-2">
        Create
      </Button>
    </form>
  )
}

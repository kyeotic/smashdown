import { Show, mergeProps, createEffect, type JSX, For } from 'solid-js'
import {
  createFormGroup,
  createFormControl,
  createFormArray,
} from 'solid-forms'
import { Button, buttonStyle, H1, H2, PageLoader } from '../components'
import { TextInput } from '../components/Forms'
import { useNavigate } from '@solidjs/router'
import { Tournament, TournamentPlayer } from './types'
import { init } from './model'

import { nanoid } from 'nanoid'
import db from '../db/local'
import { useTournaments } from './store'
import { last } from 'lodash'

interface TournamentForm {
  name: string
}

export default function NewTournamentsPage(): JSX.Element {
  const [tournaments, isLoading] = useTournaments()
  return (
    <div class="p-8">
      <H1>New Tournament</H1>

      <Show when={!isLoading()} fallback={<PageLoader />}>
        <NewTournament previous={last(tournaments())} />
      </Show>
    </div>
  )
}

export function NewTournament(props: { previous?: Tournament }): JSX.Element {
  console.log('prev', props.previous)
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
    players: createFormArray(
      props.previous
        ? props.previous.players.map((p) => createFormControl(p.name))
        : [createFormControl(''), createFormControl('')],
    ),
  })

  async function submit(e: Event) {
    e.preventDefault()
    const name = form.value.name!
    const rosterSize = parseFloat(form.value.rosterSize!)
    const players = [...(form.value.players?.values() ?? [])].map(
      (t) =>
        ({
          name: t,
          id: nanoid(),
          roster: [],
        } as TournamentPlayer),
    )

    const tournament = init({
      name,
      players,
      rosterSize,
    })
    await db.tournaments.save(tournament)

    navigate(`/tournaments/${tournament.id}`)
  }

  function addPlayer() {
    form.controls.players.push(createFormControl(''))
  }

  function removePlayer(index: number) {
    form.controls.players.removeControl(index)
  }

  return (
    <form onsubmit={submit}>
      <TextInput label="Tournament Name" control={form.controls.name} />
      <TextInput
        label="Roster Size"
        type="number"
        control={form.controls.rosterSize}
      />

      <div class="my-4 flex">
        <H2 class="flex-auto">Players</H2>
        <Button onclick={addPlayer} primary class="flex-none">
          ➕ Add Player
        </Button>
      </div>
      <For each={form.controls.players.controls}>
        {(player, index) => (
          <div class="flex gap-4">
            <TextInput
              label="Player Name"
              name={index().toString()}
              control={player}
              class="flex-auto"
            />
            <Button
              onclick={[removePlayer, index()]}
              class="flex-none mt-7 mb-2"
            >
              ❌
            </Button>
          </div>
        )}
      </For>
      <Button type="submit" primary>
        Create
      </Button>
    </form>
  )
}

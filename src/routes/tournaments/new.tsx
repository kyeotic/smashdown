import { Show, mergeProps, createEffect, type JSX, For } from 'solid-js'
import {
  createFormGroup,
  createFormControl,
  createFormArray,
} from 'solid-forms'
import { Button, H1, H2 } from '../../components'
import { TextInput } from '../../components/Forms'
import { useNavigate } from 'solid-start'
import { Tournament, TournamentPlayer } from '../../tournaments/types'
import { init } from '../../tournaments/util'

import { nanoid } from 'nanoid'
import db from '../../db/local'

interface TournamentForm {
  name: string
}

export default function NewTournament(): JSX.Element {
  const navigate = useNavigate()
  const form = createFormGroup({
    name: createFormControl(''),
    rosterSize: createFormControl('10', {
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
    }),
    players: createFormArray([createFormControl(''), createFormControl('')]),
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
    <form onsubmit={submit} class="p-8">
      <H1>New Tournament</H1>
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

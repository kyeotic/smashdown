import { Match, Switch, Show, For, type JSX, createSignal } from 'solid-js'
import { filter, last, round, shuffle } from 'lodash'
import { Button, H1, H2, TextInput, Modal, Label, H3 } from '../components'
import RosterList from './RosterList'
import {
  type Fighter,
  type TournamentPlayer,
  Tournament,
  Player,
  type Round,
  type FinishedRound,
} from './types'
import {
  getFinishedRounds,
  getLostRoster,
  getNextFighter,
  hasFinished,
} from './model'
import RosterSelect from './RosterSelect'
import { getRandomFighter } from './roster'
import { unwrap } from 'solid-js/store'
import FighterCard from './FighterCard'
import classNames from 'classnames'

export default function TournamentEdit(props: {
  tournament: Tournament
  onChange: (updated: Tournament) => void
}): JSX.Element {
  return (
    <div class="p4">
      <H1>{props.tournament.name}</H1>
      <Switch>
        <Match when={!props.tournament?.startedOn}>
          <TournamentDraft {...props} />
        </Match>
        <Match when={props.tournament?.startedOn}>
          <TournamentPlay {...props} />
        </Match>
      </Switch>
    </div>
  )
}

function TournamentDraft(props: {
  tournament: Tournament
  onChange: (updated: Tournament) => void
}): JSX.Element {
  function update(player: TournamentPlayer) {
    const t = { ...props.tournament, players: [...props.tournament.players] }
    t.players.splice(
      t.players.findIndex((p) => p.id === player.id),
      1,
      player,
    )
    props.onChange(t)
  }
  const arePlayersReady = () => {
    return props.tournament.players.every(
      (p) => p.roster.length === props.tournament.rosterSize,
    )
  }
  function endDraft() {
    if (!arePlayersReady()) return
    props.onChange(
      startNewRound({
        ...props.tournament,
        startedOn: new Date(),
        players: props.tournament.players.map((p) => ({
          ...p,
          roster: shuffle(p.roster),
        })),
      }),
    )
  }
  return (
    <div>
      <Label>Roster Size: {props.tournament.rosterSize}</Label>
      <For each={props.tournament.players}>
        {(player) => (
          <RosterDraft
            tournament={props.tournament}
            player={player}
            onChange={update}
          />
        )}
      </For>
      <Show when={arePlayersReady()}>
        <Button primary onclick={endDraft} class="my-4">
          Start Tournament
        </Button>
      </Show>
    </div>
  )
}

function RosterDraft(props: {
  tournament: Tournament
  player: TournamentPlayer
  onChange: (p: TournamentPlayer) => void
}): JSX.Element {
  const [showSelect, setShow] = createSignal(false)

  function addFighters(fighters: Fighter[]) {
    const roster = [...unwrap(props.player.roster)]
    roster.push(
      ...fighters.slice(0, props.tournament.rosterSize - roster.length),
    )
    props.onChange({ ...props.player, roster })
    setShow(false)
  }
  function removeFighter(f: Fighter) {
    const p = {
      ...props.player,
      roster: filter(props.player.roster, (r) => r.id !== f.id),
    }
    props.onChange(p)
  }

  function addRandom() {
    addFighters([getRandomFighter(unwrap(props.player.roster))])
  }

  return (
    <div>
      <H2>{props.player.name}</H2>
      <RosterList roster={props.player.roster} onSelect={removeFighter} />
      <Show when={props.player.roster.length < props.tournament.rosterSize}>
        <div class="flex gap-4 my-4">
          <Button onclick={addRandom}>➕ Add Random</Button>
          <Button onclick={() => setShow(true)} primary>
            ➕ Pick
          </Button>
        </div>
      </Show>
      <Show when={showSelect()}>
        <Modal>
          <div class="bg-white min-h-screen p-2">
            <RosterSelect
              onSubmit={addFighters}
              onCancel={() => setShow(false)}
              hide={props.player.roster}
            />
          </div>
        </Modal>
      </Show>
    </div>
  )
}

function TournamentPlay(props: {
  tournament: Tournament
  onChange: (updated: Tournament) => void
}): JSX.Element {
  return (
    <div>
      <H2>Round: {props.tournament.rounds.length}</H2>

      <For each={props.tournament.rounds}>
        {(round) => (
          <Switch>
            <Match when={!(round as FinishedRound).finishedOn}>
              <TournmentRound
                round={round}
                tournament={props.tournament}
                onChange={props.onChange}
              />
            </Match>
            <Match when={(round as FinishedRound).finishedOn}>
              <TournmentFinishedRound
                round={round as FinishedRound}
                tournament={props.tournament}
                onChange={props.onChange}
              />
            </Match>
          </Switch>
        )}
      </For>

      <Show when={hasFinished(props.tournament)}>
        <>
          <H2>Winner: {props.tournament.winner?.name}</H2>
        </>
      </Show>

      <For each={props.tournament.players}>
        {(player) => {
          const lost = () => getLostRoster(player, props.tournament)
          return (
            <>
              <H3>{player.name}</H3>
              <RosterList roster={player.roster} lost={lost()} />
            </>
          )
        }}
      </For>
    </div>
  )
}

function TournmentRound(props: {
  round: Round
  tournament: Tournament
  onChange: (updated: Tournament) => void
}): JSX.Element {
  function selectWinner(player: Player) {
    const rounds = props.tournament.rounds.slice(
      0,
      props.tournament.rounds.length - 1,
    )
    const lastRound = {
      ...props.tournament.rounds[props.tournament.rounds.length - 1],
    } as FinishedRound
    lastRound.winner = player
    lastRound.losers = lastRound.players
      .filter((p) => p.player.id !== player.id)
      .map((p) => p.player)
    lastRound.finishedOn = new Date()
    rounds.push(lastRound)
    if (
      !hasFinished({
        ...props.tournament,
        rounds,
      })
    ) {
      props.onChange(
        startNewRound({
          ...props.tournament,
          rounds,
        }),
      )
    } else {
      props.onChange({
        ...props.tournament,
        rounds,
        winner: player,
        isComplete: true,
      })
    }
  }
  return (
    <div class="flex gap-4">
      <For each={props.round.players}>
        {(player) => (
          <div>
            <span>{player.player.name}</span>
            <FighterCard
              fighter={player.fighter}
              onClick={() => selectWinner(player.player)}
            />
          </div>
        )}
      </For>
    </div>
  )
}

function TournmentFinishedRound(props: {
  round: FinishedRound
  tournament: Tournament
  onChange: (updated: Tournament) => void
}): JSX.Element {
  function revert() {
    const finished = getFinishedRounds(props.tournament)
    const isPrevious = props.round === finished[finished.length - 1]
    console.log('reverting', isPrevious)
    if (!isPrevious) return
    props.onChange({
      ...props.tournament,
      rounds: [
        ...finished.slice(0, finished.length - 1),
        { players: props.round.players },
      ],
    })
  }
  return (
    <div class="flex gap-4">
      <For each={props.round.players}>
        {(player) => (
          <div>
            <span>{player.player.name}</span>
            <FighterCard
              fighter={player.fighter}
              class={
                props.round.winner.id !== player.player.id
                  ? 'bg-red-400'
                  : undefined
              }
              onClick={revert}
            />
          </div>
        )}
      </For>
    </div>
  )
}

function startNewRound(tournament: Tournament): Tournament {
  return {
    ...tournament,
    rounds: [
      ...tournament.rounds,
      {
        players: tournament.players.map((p) => ({
          player: p,
          fighter: getNextFighter(p, tournament),
        })),
      },
    ],
  }
}

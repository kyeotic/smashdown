import {
  Match,
  Switch,
  Show,
  For,
  type JSX,
  createSignal,
  onMount,
  createMemo,
} from 'solid-js'
import { filter, last, shuffle } from 'lodash'
import { Button, H1, H2, Modal, Label, H3, bodyStyle } from '../components'
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
  isFinished,
  getFinishedRounds,
  getLostRoster,
  getNextFighter,
  hasFinished,
} from './model'
import RosterSelect from './RosterSelect'
import { getRandomFighter, getRandomFighters } from './roster'
import { unwrap } from 'solid-js/store'
import FighterCard from './FighterCard'
import { scrollToCenter } from '../util/dom'
import { StatProvider, useStatContext } from './StatContext'
import { useNavigate } from '@solidjs/router'
import { HOME } from '../root/routes'
import { PlayerProvider } from '../players/context'
import { StatSummary } from './StatSummary'
import { useStores } from '../data/stores'
import { RoundProvider, TournamentProvider } from './context'

const GRID_COLS = ['grid-cols-2']

export default function TournamentEdit(props: {
  tournament: Tournament
  onChange: (updated: Tournament) => void
}): JSX.Element {
  const { tournaments: store } = useStores()
  const navigate = useNavigate()
  return (
    <div class="max-w-xl mx-auto">
      <H1>{props.tournament.name}</H1>
      <Switch>
        <Match when={!props.tournament?.startedOn}>
          <TournamentDraft {...props} />
        </Match>
        <Match when={props.tournament?.startedOn}>
          <TournamentPlay {...props} />
        </Match>
      </Switch>

      <Button
        class="mt-8"
        danger
        onclick={() => {
          if (window.confirm('Delete tournament? This cannot be undone')) {
            store.delete(props.tournament.id)
            navigate(HOME)
          }
        }}
      >
        Delete
      </Button>
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
  function fillRandom() {
    addFighters(
      getRandomFighters(
        props.tournament.rosterSize - props.player.roster.length,
        unwrap(props.player.roster),
      ),
    )
  }

  return (
    <div class="mt-4">
      <H2>{props.player.name}'s Roster</H2>
      <RosterList roster={props.player.roster} onSelect={removeFighter} />
      <Show when={props.player.roster.length < props.tournament.rosterSize}>
        <div class="flex gap-4 my-4">
          <Button onclick={addRandom}>➕ Add Random</Button>
          <Button onclick={fillRandom}>🪣 Fill Random</Button>
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
    <TournamentProvider tournament={props.tournament}>
      <StatProvider tournament={props.tournament}>
        <div class="mt-8">
          <H2>Rounds</H2>

          <For each={props.tournament.rounds}>
            {(round) => (
              <TournamentRound
                round={round}
                tournament={props.tournament}
                onChange={props.onChange}
              />
            )}
          </For>

          <Show when={hasFinished(props.tournament)}>
            <>
              <H2>Winner: {props.tournament.winner?.name}</H2>
            </>
          </Show>

          <For each={props.tournament.players}>
            {(player) => {
              function bg(f: Fighter): string {
                return getLostRoster(player, props.tournament).some(
                  (l) => l.id === f.id,
                )
                  ? 'bg-red-400'
                  : 'bg-slate-400'
              }
              return (
                <PlayerProvider player={player}>
                  <H3 class="mt-8">{player.name}'s Roster</H3>
                  <RosterList roster={player.roster} fighterClass={bg} />
                </PlayerProvider>
              )
            }}
          </For>
        </div>
      </StatProvider>
    </TournamentProvider>
  )
}

function TournamentRound(props: {
  round: Round
  tournament: Tournament
  onChange: (updated: Tournament) => void
}): JSX.Element {
  let container: HTMLDivElement | undefined
  const ctxStats = useStatContext()
  const isCurrentRound = createMemo(() => isFinished(props.round))

  onMount(() => {
    if (
      props.tournament.finishedOn ||
      last(props.tournament.rounds) !== props.round
    )
      return
    // console.log('scrolling to', container)
    setTimeout(() => scrollToCenter(container!, { smooth: false }), 100)
  })

  function onClick(player: Player) {
    if (!isFinished(props.round)) {
      selectWinner(player)
    } else revert()
  }

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

  function revert() {
    const finished = getFinishedRounds(props.tournament)
    const isPrevious = props.round === finished[finished.length - 1]
    if (!isPrevious) return
    props.onChange({
      ...props.tournament,
      rounds: [
        ...finished.slice(0, finished.length - 1),
        { players: props.round.players },
      ],
    })
  }

  function getClass(player: Player) {
    return (
      (isFinished(props.round)
        ? props.round.winner.id !== player.id
          ? 'bg-red-400'
          : 'bg-green-400'
        : 'bg-slate-400') + ' flex-auto '
    )
  }

  function rosterIndex(player: {
    player: Player
    fighter: Fighter
  }): JSX.Element {
    const roster = props.tournament.players.find(
      (p) => p.id == player.player.id,
    )?.roster
    if (!roster) throw new Error('Illegal player')
    return roster.findIndex((r) => r.id === player.fighter.id) + 1
  }

  const players = createMemo(() =>
    props.round.players.map((p) => ({
      ...p,
      stats: ctxStats()?.[p.player.id]?.record[p.fighter.id],
    })),
  )

  return (
    <div
      ref={container}
      class={`grid grid-cols-${props.round.players.length} gap-4 mt-4`}
    >
      <For each={players()}>
        {(player) => {
          return (
            <RoundProvider round={props.round}>
              <div class="flex gap-0 flex-col">
                <span
                  class={bodyStyle('flex-0 text-md lg:text-xl font-medium')}
                >
                  {player.player.name} ({rosterIndex(player)}/
                  {props.tournament.rosterSize})
                </span>
                <FighterCard
                  class={getClass(player.player)}
                  fighter={player.fighter}
                  onClick={() => onClick(player.player)}
                />
                <StatSummary stats={player.stats} />
              </div>
            </RoundProvider>
          )
        }}
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

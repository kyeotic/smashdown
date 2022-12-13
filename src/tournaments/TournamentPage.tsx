import { Show } from 'solid-js'
import { H1 } from '../components'
import { useTournament } from './store'
import TournamentEdit from './Tournament'
import { Tournament } from './types'
import { useParams } from '@solidjs/router'

export default function TournamentPage() {
  const { id } = useParams()
  const tournamentResource = useTournament(id)
  const tournament = tournamentResource[0]
  function onChange(updated: Tournament) {
    tournamentResource[1].mutate(updated)
  }
  return (
    <Show when={tournament()} fallback={<H1>Not Found</H1>}>
      <TournamentEdit tournament={tournament()!} onChange={onChange} />
    </Show>
  )
}

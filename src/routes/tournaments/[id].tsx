import { Show } from 'solid-js'
import { useParams } from 'solid-start'
import { H1 } from '../../components'
import { useTournament } from '../../tournaments/store'
import TournamentEdit from '../../tournaments/Tournament'
import { Tournament } from '../../tournaments/types'

export default function TournamentPage() {
  const { id } = useParams()
  const tournamentResource = useTournament(id)
  const tournament = tournamentResource[0]
  function onChange(updated: Tournament) {
    tournamentResource[1].mutate(updated)
  }
  return (
    <div class="p-4">
      <Show when={tournament()} fallback={<H1>Not Found</H1>}>
        <TournamentEdit tournament={tournament()!} onChange={onChange} />
      </Show>
    </div>
  )
}

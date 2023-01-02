import { Show, Suspense } from 'solid-js'
import { H1 } from '../components'
import { useTournament } from './hooks'
import TournamentEdit from './Tournament'
import { useParams } from '@solidjs/router'

export default function TournamentPage() {
  const { id } = useParams()
  const [tournament, onChange] = useTournament(id)
  return (
    <Suspense fallback={<span>loading</span>}>
      <Show when={tournament()} fallback={<H1>Not Found</H1>}>
        <TournamentEdit tournament={tournament()!} onChange={onChange} />
      </Show>
    </Suspense>
  )
}

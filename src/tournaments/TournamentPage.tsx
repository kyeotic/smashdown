import { Show, Suspense } from 'solid-js'
import { H1, PageLoader } from '../components'
import { useTournament } from './hooks'
import TournamentEdit from './Tournament'
import { useParams } from '@solidjs/router'
import { useTournamentStore } from './context'
import { Tournament } from './types'

export default function TournamentPage() {
  const { id } = useParams()
  // const [tournament, onChange] = useTournament(id)
  const store = useTournamentStore()

  const tournament = () => store.get(id)
  async function onChange(t: Tournament): Promise<void> {
    await store.update(t)
  }
  return (
    <Show when={!store.isLoading} fallback={<PageLoader />}>
      <TournamentEdit tournament={tournament()!} onChange={onChange} />
    </Show>
  )
}

import { Show, Suspense } from 'solid-js'
import { H1, PageLoader } from '../components'
import TournamentEdit from './Tournament'
import { useParams } from '@solidjs/router'
import { Tournament } from './types'
import { useStores } from '../data/stores'

export default function TournamentPage() {
  const { id } = useParams()
  const { tournaments: store } = useStores()

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

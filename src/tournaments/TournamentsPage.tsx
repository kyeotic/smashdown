import { Show, type JSX } from 'solid-js'
import { A } from '@solidjs/router'

import { H1, buttonStyle, PageLoader } from '../components'
import TournamentList from './TournamentList'
import { useTournaments } from './hooks'
import { Tournament } from './types'
import { useTournamentStore } from './context'

export default function TournamentsPage(): JSX.Element {
  const [tournaments, isLoading] = useTournaments()
  const store = useTournamentStore()
  return (
    <div>
      <H1>Tournaments</H1>
      <A href="/tournaments/new" class={buttonStyle({ primary: true })}>
        Create New Tournament
      </A>

      <Show when={!store.isLoading} fallback={<PageLoader />}>
        <TournamentList tournaments={store.tournaments} />
      </Show>
    </div>
  )
}

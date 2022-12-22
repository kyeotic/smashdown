import { Show, type JSX } from 'solid-js'
import { A } from '@solidjs/router'

import { H1, buttonStyle, PageLoader } from '../components'
import TournamentList from './tournamentList'
import { useTournaments } from './store'
import { Tournament } from './types'

export default function TournamentsPage(): JSX.Element {
  const [tournaments, isLoading] = useTournaments()
  return (
    <div>
      <H1>Tournaments</H1>
      <A href="/tournaments/new" class={buttonStyle({ primary: true })}>
        Create New Tournament
      </A>

      <Show when={!isLoading()} fallback={<PageLoader />}>
        <TournamentList tournaments={tournaments()} />
      </Show>
    </div>
  )
}

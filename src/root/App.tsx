import { ErrorBoundary } from 'solid-js'
import { MODAL_ROOT_ID } from '../components/Modal/Modal'
import { Router, useRoutes, A } from '@solidjs/router'

import NavBar from './NavBar'
import NewTournament from '../tournaments/NewTournamentPage'
import TournamentPage from '../tournaments/TournamentPage'
import TournamentsPage from '../tournaments/TournamentsPage'

const routes = [
  {
    path: '/tournaments/new',
    component: () => <NewTournament />,
  },
  {
    path: '/tournaments/:id',
    component: () => <TournamentPage />,
  },
  {
    path: '/',
    component: () => <TournamentsPage />,
  },
]

export default function Root() {
  const Routes = useRoutes(routes)
  return (
    <ErrorBoundary fallback={(err) => err}>
      <>
        <NavBar />
        <main class="w-full p-4 space-y-2">
          <Routes />
        </main>
        <div id={MODAL_ROOT_ID} />
      </>
    </ErrorBoundary>
  )
}

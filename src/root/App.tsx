import { ErrorBoundary } from 'solid-js'
import { MODAL_ROOT_ID } from '../components/Modal/Modal'
import { Router, useRoutes, A } from '@solidjs/router'

import NavBar from './NavBar'
import Footer from './Footer'
import NewTournament from '../tournaments/NewTournamentPage'
import TournamentPage from '../tournaments/TournamentPage'
import TournamentsPage from '../tournaments/TournamentsPage'
import DataUtilities from '../db/DataUtilities'

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
    path: '/util',
    component: () => <DataUtilities />,
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
      <div class="w-full flex flex-col min-h-screen max-h-screen">
        <NavBar />
        <main class="w-full max-h-full p-4 flex-grow overflow-scroll flex flex-col">
          <Routes />
        </main>
        <Footer />
        <div id={MODAL_ROOT_ID} />
      </div>
    </ErrorBoundary>
  )
}

import { ErrorBoundary, onMount } from 'solid-js'
import { MODAL_ROOT_ID } from '../components/Modal/Modal'
import { useRoutes } from '@solidjs/router'

import NavBar from './NavBar'
import Footer from './Footer'
import { routes } from './routes'
import { useTournamentInit } from '../tournaments/hooks'

export default function Root() {
  const Routes = useRoutes(routes)
  useTournamentInit()
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

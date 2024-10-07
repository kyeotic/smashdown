import { ErrorBoundary, JSX, onMount } from 'solid-js'
import { MODAL_ROOT_ID } from '../components/Modal/Modal'
import { useNavigate, useRoutes } from '@solidjs/router'
import { Toaster } from 'solid-toast'

import NavBar from './NavBar'
import Auth from '../auth/Auth'
import { routes, TOURNAMENT } from './routes'
import { TournamentStoreProvider } from '../tournaments/context'
import { PlayerStoreProvider } from '../players/context'
import { TournamentDbProvider, useTournamentDb } from '../tournaments/db'

export default function Root() {
  const Routes = useRoutes(routes)

  return (
    <ErrorBoundary fallback={(err) => err}>
      <div class="w-full flex flex-col min-h-screen max-h-screen">
        <NavBar />
        <main class="w-full max-h-full p-4 flex-grow overflow-scroll flex flex-col">
          <Auth>
            <PlayerStoreProvider>
              <TournamentDbProvider>
                <TournamentStoreProvider>
                  <Init />
                  <Routes />
                </TournamentStoreProvider>
              </TournamentDbProvider>
            </PlayerStoreProvider>
          </Auth>
        </main>
        {/* <Footer /> */}
        <Toaster position="bottom-right" />
        <div id={MODAL_ROOT_ID} />
      </div>
    </ErrorBoundary>
  )
}

function Init(): JSX.Element {
  useTournamentInit()
  return null
}

//** load the latest unfinished tournament */
export function useTournamentInit() {
  const store = useTournamentDb()
  const navigate = useNavigate()

  onMount(async () => {
    const dbTournaments = await store.getPage()
    const latestUnfinished = dbTournaments.find((t) => !t.finishedOn)
    if (latestUnfinished) {
      navigate(TOURNAMENT(latestUnfinished.id))
    }
  })
}

import { ErrorBoundary, JSX, onMount, ParentProps } from 'solid-js'
import { MODAL_ROOT_ID } from '../components/Modal/Modal'
import { useNavigate } from '@solidjs/router'
import { Toaster } from 'solid-toast'

import NavBar from './NavBar'
import Auth from '../auth/Auth'
import { Routes, TOURNAMENT } from './routes'
import { StoresProvider, useStores } from '../data/stores'

export default function Root() {
  return <Routes root={App} />
}

export function App(props: ParentProps) {
  return (
    <ErrorBoundary fallback={(err) => err}>
      <div class="w-full flex flex-col min-h-screen max-h-screen">
        <NavBar />
        <main class="w-full max-h-full p-4 grow overflow-scroll flex flex-col">
          <Auth>
            <StoresProvider>
              <Init />
              {props.children}
            </StoresProvider>
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
  const { tournaments: store } = useStores()
  const navigate = useNavigate()

  onMount(async () => {
    await store.init()
    const dbTournaments = store.tournaments
    const latestUnfinished = dbTournaments.find((t) => !t.finishedOn)
    if (latestUnfinished) {
      if (window.location.pathname === '/') {
        navigate(TOURNAMENT(latestUnfinished.id))
      }
    }
  })
}

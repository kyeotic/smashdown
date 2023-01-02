import { ErrorBoundary, JSX } from 'solid-js'
import { MODAL_ROOT_ID } from '../components/Modal/Modal'
import { useRoutes } from '@solidjs/router'
import { Toaster } from 'solid-toast'

import NavBar from './NavBar'
import Auth from '../auth/Auth'
import { routes } from './routes'
import { useTournamentInit } from '../tournaments/hooks'
import { TournamentStoreProvider } from '../tournaments/context'
import Footer from './Footer'

export default function Root() {
  const Routes = useRoutes(routes)
  return (
    <ErrorBoundary fallback={(err) => err}>
      <div class="w-full flex flex-col min-h-screen max-h-screen">
        <NavBar />
        <main class="w-full max-h-full p-4 flex-grow overflow-scroll flex flex-col">
          <Auth>
            <TournamentStoreProvider>
              <Init />
              <Routes />
            </TournamentStoreProvider>
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

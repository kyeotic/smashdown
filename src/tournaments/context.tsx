import { createContext, type ParentProps, useContext, JSX } from 'solid-js'
import { useAuth, useSupabase } from '../auth/SupabaseProvider'
import { TournamentStore } from './store'

export const TournamentStoreContext = createContext<TournamentStore>()

export function useTournamentStore(): TournamentStore {
  const ctx = useContext(TournamentStoreContext)

  if (!ctx)
    throw new Error(
      'useTournamentStore must be used within a TournamentStoreContext.Provider',
    )

  return ctx
}

export function TournamentStoreProvider(props: ParentProps): JSX.Element {
  const supabase = useSupabase()
  const auth = useAuth()
  const store = new TournamentStore(supabase, auth)

  return (
    <TournamentStoreContext.Provider value={store}>
      {props.children}
    </TournamentStoreContext.Provider>
  )
}

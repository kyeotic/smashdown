import { createContext, type ParentProps, useContext, JSX } from 'solid-js'
import { useAuth, useSupabase } from '../auth/SupabaseProvider'
import { PlayerStore } from './store'

export const PlayerStoreContext = createContext<PlayerStore>()

export function usePlayerStore(): PlayerStore {
  const ctx = useContext(PlayerStoreContext)

  if (!ctx)
    throw new Error(
      'usePlayerStore must be used within a PlayerStoreContext.Provider',
    )

  return ctx
}

export function PlayerStoreProvider(props: ParentProps): JSX.Element {
  const supabase = useSupabase()
  const auth = useAuth()
  const store = new PlayerStore(supabase, auth)

  return (
    <PlayerStoreContext.Provider value={store}>
      {props.children}
    </PlayerStoreContext.Provider>
  )
}
import { createContext, type ParentProps, useContext, JSX } from 'solid-js'
import { TournamentStore } from './store'
import { useTournamentDb } from './db'

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
  const db = useTournamentDb()
  const store = new TournamentStore(db)

  return (
    <TournamentStoreContext.Provider value={store}>
      {props.children}
    </TournamentStoreContext.Provider>
  )
}

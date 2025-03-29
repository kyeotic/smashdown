import { type ParentProps } from 'solid-js'

import { requiredContext } from '../util/context'
import { useTrpc } from './trpc'

import { PlayerStore } from '../players/store'
import { TournamentStore } from '../tournaments/store'

export interface Stores {
  players: PlayerStore
  tournaments: TournamentStore
}

const { use: useStores, Provider: StoresProvider } = requiredContext<
  Stores,
  ParentProps
>('AppStores', (props) => {
  const trpc = useTrpc()
  return {
    players: new PlayerStore(trpc),
    tournaments: new TournamentStore(trpc),
  } as Stores
})

export { StoresProvider, useStores }

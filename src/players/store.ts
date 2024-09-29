import { AuthSession } from '@supabase/supabase-js'
import { type AppSupabaseClient } from '../auth/supabase'

import { Database, Json } from '../db/schema'
import { createStore, SetStoreFunction } from 'solid-js/store'
import { Player } from '../tournaments/types'

type PlayerTable = Database['public']['Tables']['players']
type PlayerRow = PlayerTable['Row']

const PAGE_SIZE = 50

export class PlayerStore {
  private userId: string
  readonly players: Player[]
  private setPlayers: SetStoreFunction<Player[]>

  constructor(private supabase: AppSupabaseClient, private auth: AuthSession) {
    this.userId = auth.user.id
    const [store, setStore] = createStore<Player[]>([])
    this.players = store
    this.setPlayers = setStore

    this.getPlayers().catch((e) => console.error('player store init', e))
  }

  async getPlayers({ page = 0 }: { page?: number } = {}): Promise<Player[]> {
    const { data, error } = await this.supabase
      .from('players')
      .select()
      .range(PAGE_SIZE * page, PAGE_SIZE * page + (PAGE_SIZE - 1))

    if (error) throw error

    this.setPlayers(data)

    return this.players
  }

  async create(name: string): Promise<Player> {
    const { data, error } = await this.supabase
      .from('players')
      .insert({ name, user_id: this.userId })
      .select()

    if (error) throw error
    assertSingle(data)

    const newPlayer = { name, id: data[0].id }
    this.setPlayers(this.players.length, newPlayer)
    return newPlayer
  }
}

function assertSingle(data: PlayerRow[], type = 'Select') {
  if (data.length !== 1) {
    console.error(`${type} bad result`, data)
    throw new Error(`Period ${type} failed`)
  }
}

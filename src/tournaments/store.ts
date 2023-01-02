import { AuthSession } from '@supabase/supabase-js'
import { type AppSupabaseClient } from '../auth/supabase'

import { Database, Json } from '../db/schema'
import { Tournament } from './types'
import { deserialize, serialize } from './model'

type TournamentTable = Database['public']['Tables']['tournaments']
type TournamentRow = TournamentTable['Row']

const PAGE_SIZE = 50

export class TournamentStore {
  private userId: string

  constructor(private supabase: AppSupabaseClient, private auth: AuthSession) {
    this.userId = auth.user.id
  }

  async getPage({
    page = 0,
    leagueId,
  }: { page?: number; leagueId?: string } = {}): Promise<Tournament[]> {
    let query = this.supabase.from('tournaments').select()

    if (leagueId) query = query.eq('league_id', leagueId)
    else query = query.is('league_id', null)

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(PAGE_SIZE * page, PAGE_SIZE * page + (PAGE_SIZE - 1))

    if (error) throw error

    return data.map(fromDb)
  }

  async get(id: string): Promise<Tournament> {
    const { data, error } = await this.supabase
      .from('tournaments')
      .select()
      .eq('id', id)

    if (error) throw error
    assertSingle(data)

    return fromDb(data[0])
  }

  async create(tournament: Tournament): Promise<Tournament> {
    const { data, error } = await this.supabase
      .from('tournaments')
      .insert({
        user_id: this.userId,
        data: serialize(tournament) as unknown as Json,
      })
      .select()

    if (error) throw error
    assertSingle(data)

    tournament.id = data[0].id

    return tournament
  }

  async update(tournament: Tournament): Promise<void> {
    const { error } = await this.supabase
      .from('tournaments')
      .update({
        data: serialize(tournament) as unknown as Json,
      })
      .eq('id', tournament.id)

    if (error) throw error
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tournaments')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

function fromDb(row: TournamentRow): Tournament {
  return deserialize({ id: row.id, ...(row.data as any) })
}

function assertSingle(data: TournamentRow[], type = 'Select') {
  if (data.length !== 1) {
    console.error(`${type} bad result`, data)
    throw new Error(`Period ${type} failed`)
  }
}

import { listAllValues, upsert, makeSet } from '../util/kv.ts'
import { Tournament } from './types.ts'

const TOURNAMENTS = makeSet('TOURNAMENTS')

export default class TournamentStore {
  constructor(private readonly kv: Deno.Kv) {}

  async getForUser(userId: string): Promise<Tournament[]> {
    return await listAllValues(this.kv, TOURNAMENTS(userId))
  }

  async put(userId: string, tournament: Tournament): Promise<Tournament> {
    return await upsert(
      this.kv,
      TOURNAMENTS(userId, tournament.id),
      (existing) => {
        tournament.createdOn = existing?.createdOn ?? tournament.createdOn
        tournament.updatedOn = new Date()
        return tournament
      },
    )
  }

  async delete(userId: string, id: string): Promise<void> {
    return await this.kv.delete(TOURNAMENTS(userId, id))
  }
}

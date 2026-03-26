import { listAllValues, makeKey, kvUpsert } from '../util/kv'
import { Tournament, TournamentSchema } from './types'

export default class TournamentStore {
  constructor(private readonly kv: KVNamespace) {}

  async getForUser(userId: string): Promise<Tournament[]> {
    const raw = await listAllValues<unknown>(this.kv, makeKey('TOURNAMENTS', userId) + ':')
    return raw.map((v) => TournamentSchema.parse(v))
  }

  async put(userId: string, tournament: Tournament): Promise<Tournament> {
    return await kvUpsert<Tournament>(
      this.kv,
      makeKey('TOURNAMENTS', userId, tournament.id),
      (existing) => {
        const parsed = existing ? TournamentSchema.parse(existing) : null
        tournament.createdOn = parsed?.createdOn ?? tournament.createdOn
        tournament.updatedOn = new Date()
        return tournament
      },
    )
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.kv.delete(makeKey('TOURNAMENTS', userId, id))
  }
}

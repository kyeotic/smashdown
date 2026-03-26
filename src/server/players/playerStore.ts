import { listAllValues, makeKey, kvCreate } from '../util/kv'
import { Player } from './types'

export default class PlayerStore {
  constructor(private readonly kv: KVNamespace) {}

  async getForUser(userId: string): Promise<Player[]> {
    return await listAllValues<Player>(this.kv, makeKey('PLAYERS', userId) + ':')
  }

  async create(userId: string, player: Player): Promise<Player> {
    return await kvCreate(this.kv, makeKey('PLAYERS', userId, player.id), player)
  }
}

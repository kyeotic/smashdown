import type { WorkerEnv } from './types'
import UserStore from './users/userStore'
import PlayerStore from './players/playerStore'
import TournamentStore from './tournaments/tournamentStore'
import { createJwtVerifier } from './auth/jwt'
import { getConfig } from './config'

export function createAppContext(env: WorkerEnv) {
  return {
    stores: {
      users: new UserStore(env.SMASHDOWN_KV),
      players: new PlayerStore(env.SMASHDOWN_KV),
      tournaments: new TournamentStore(env.SMASHDOWN_KV),
    },
    verifyJwt: createJwtVerifier(env.AUTH0_DOMAIN, env.AUTH0_AUDIENCE),
    config: getConfig(env),
  }
}

export type AppContext = ReturnType<typeof createAppContext>
export type Context = AppContext & { req: Request }

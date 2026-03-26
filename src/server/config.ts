import type { WorkerEnv } from './types'

export function getConfig(env: WorkerEnv) {
  return {
    auth0Domain: env.AUTH0_DOMAIN,
    auth0Audience: 'kyeotek',
  }
}

export type Config = ReturnType<typeof getConfig>

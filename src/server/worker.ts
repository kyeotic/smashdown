import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { router } from './trpc'
import { createAppContext } from './context'
import type { WorkerEnv } from './types'

import { playerRouter } from './players/routes'
import { tournamentRouter } from './tournaments/routes'

const appRouter = router({
  players: playerRouter,
  tournaments: tournamentRouter,
})

export type AppRouter = typeof appRouter

const app = new Hono<{ Bindings: WorkerEnv }>()

app.use('/api/*', cors())

app.all('/api/*', async (c) => {
  const ctx = createAppContext(c.env)
  return fetchRequestHandler({
    endpoint: '/api',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({ ...ctx, req: c.req.raw }),
  })
})

app.get('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app

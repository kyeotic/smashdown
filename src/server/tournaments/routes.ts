import z from 'zod'
import { router, authProcedure } from '../trpc.ts'
import { TournamentSchema } from './types.ts'

export const tournamentRouter = router({
  getAll: authProcedure.query(async ({ ctx: { user, stores } }) => {
    return await stores.tournaments.getForUser(user.id)
  }),
  put: authProcedure
    .input(TournamentSchema)
    .mutation(async ({ input, ctx: { user, stores } }) => {
      return await stores.tournaments.put(user.id, input)
    }),
  delete: authProcedure
    .input(z.string())
    .mutation(async ({ input, ctx: { user, stores } }) => {
      return await stores.tournaments.delete(user.id, input)
    }),
})

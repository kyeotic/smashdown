import { z } from 'zod'
import { PlayerSchema } from '../players/types.ts'

export const TournamentPlayerSchema = PlayerSchema.extend({
  roster: z.array(z.string()),
})

export type TournamentPlayer = z.infer<typeof TournamentPlayerSchema>

export const TournamentSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdOn: z.coerce.date(),
  updatedOn: z.coerce.date(),
  startedOn: z.optional(z.coerce.date()),
  rosterSize: z.number(),
  players: z.array(TournamentPlayerSchema),
  rounds: z.array(
    z.object({
      players: z.array(
        z.object({
          playerId: z.string(),
          fighterId: z.string(),
        }),
      ),
      winnerId: z.optional(z.string()),
      loserIds: z.optional(z.array(z.string())),
      finishedOn: z.optional(z.coerce.date()),
    }),
  ),
  isComplete: z.boolean(),
  finishedOn: z.optional(z.coerce.date()),
  winnerId: z.optional(z.string()),
})

export type Tournament = z.infer<typeof TournamentSchema>

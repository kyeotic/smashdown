import { z } from 'zod'
import { PlayerSchema, Player } from '../../server/players/types.ts'
import {
  TournamentPlayerSchema as SerialTournamentPlayerSchema,
  TournamentPlayer as SerialTournamentPlayer,
  TournamentSchema as SerialTournamentSchema,
  Tournament as SerialTournament,
} from '../../server/tournaments/types.ts'

export {
  SerialTournamentSchema,
  SerialTournamentPlayerSchema,
  PlayerSchema,
  type Player,
  type SerialTournamentPlayer,
  type SerialTournament,
}

export const FighterSchema = z.object({
  id: z.string(),
  name: z.string(),
  isMii: z.boolean(),
  icon: z.string(),
})

export type Fighter = z.infer<typeof FighterSchema>

export const TournamentPlayerSchema = SerialTournamentPlayerSchema.extend({
  roster: z.array(FighterSchema),
})

export type TournamentPlayer = z.infer<typeof TournamentPlayerSchema>

export const RoundSchema = z.object({
  players: z.array(
    z.object({
      player: PlayerSchema,
      fighter: FighterSchema,
    }),
  ),
})

export type Round = z.infer<typeof RoundSchema>

export const FinishedRoundSchema = RoundSchema.extend({
  winner: PlayerSchema,
  losers: z.array(PlayerSchema),
  finishedOn: z.date(),
})

export type FinishedRound = z.infer<typeof FinishedRoundSchema>

export const TournamentSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdOn: z.coerce.date(),
  startedOn: z.optional(z.coerce.date()),
  finishedOn: z.optional(z.coerce.date()),
  rosterSize: z.number(),
  players: z.array(TournamentPlayerSchema),
  // Finished needs to come first or it will return early on unfinished
  rounds: z.array(z.union([FinishedRoundSchema, RoundSchema])),
  isComplete: z.boolean(),
  winner: z.optional(PlayerSchema),
})

export type Tournament = z.infer<typeof TournamentSchema>

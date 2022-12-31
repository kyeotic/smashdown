import { useNavigate } from '@solidjs/router'
import { orderBy, first } from 'lodash'
import { onMount } from 'solid-js'
import db from '../db/local'
import { TOURNAMENT } from '../root/routes'

//** App mount hook to load the latest unfinished tournament */
export function useTournamentInit() {
  const navigate = useNavigate()
  onMount(async () => {
    const dbTournaments = await db.tournaments.getAll()
    const tournaments = orderBy(Object.values(dbTournaments), [
      'createdOn',
      'desc',
    ])
    const latest = first(tournaments)
    if (latest && !latest.finishedOn) {
      navigate(TOURNAMENT(latest.id))
    }
  })
}

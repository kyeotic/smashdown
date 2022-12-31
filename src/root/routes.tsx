import NewTournament from '../tournaments/NewTournamentPage'
import TournamentPage from '../tournaments/TournamentPage'
import TournamentsPage from '../tournaments/TournamentsPage'
import DataUtilities from '../db/DataUtilities'

export const HOME = '/'
export const TOURNAMENTS_NEW = '/tournaments/new'
export const TOURNAMENT = (id: string) => `/tournaments/${id}`
export const UTIL = '/util'

export const routes = [
  {
    path: TOURNAMENTS_NEW,
    component: () => <NewTournament />,
  },
  {
    path: TOURNAMENT(':id'),
    component: () => <TournamentPage />,
  },
  {
    path: UTIL,
    component: () => <DataUtilities />,
  },
  {
    path: HOME,
    component: () => <TournamentsPage />,
  },
]

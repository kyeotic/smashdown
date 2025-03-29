import { Route, Router } from '@solidjs/router'
import { Component, JSX } from 'solid-js'

import NewTournament from '../tournaments/NewTournamentPage'
import TournamentPage from '../tournaments/TournamentPage'
import TournamentsPage from '../tournaments/TournamentsPage'
// import DataUtilities from '../db/DataUtilities'
import ProfilePage from '../user/ProfilePage'
import PlayersPage from '../players/PlayersPage'

export const HOME = '/'
export const TOURNAMENTS_NEW = '/tournaments/new'
export const TOURNAMENT = (id: string) => `/tournaments/${id}`
export const UTIL = '/util'
export const USER_PROFILE = '/user/security'
export const PLAYERS = '/players'

export function Routes(props: { root: Component }): JSX.Element {
  return (
    <Router root={props.root}>
      <Route path={HOME} component={TournamentsPage} />
      <Route path={TOURNAMENTS_NEW} component={NewTournament} />
      <Route path={TOURNAMENT(':id')} component={TournamentPage} />
      <Route path={PLAYERS} component={PlayersPage} />
      <Route path={USER_PROFILE} component={ProfilePage} />
      {/* <Route path={UTIL} component={DataUtilities} /> */}
    </Router>
  )
}

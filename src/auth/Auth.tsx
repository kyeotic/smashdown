import {
  createSignal,
  Match,
  Switch,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { useAuthStateChange, AuthProvider } from './SupabaseProvider'
import { type AuthSession } from '@supabase/supabase-js'

import Login from './Login'
import UserSecurity from '../auth/UserSecurity'

export default function Auth(props: ParentProps): JSX.Element {
  const [session, setSession] = createSignal<AuthSession | null>(null)
  const [needsNewPassword, setNeedsNew] = createSignal<boolean>(false)

  // useAuthInit((result) => {
  //   console.log('supa init', result)
  // })

  useAuthStateChange((_event, session) => {
    // console.log('onAuthStateChange', _event, session)
    if (_event === 'PASSWORD_RECOVERY') {
      setNeedsNew(true)
    } else if (_event === 'USER_UPDATED') {
      setNeedsNew(false)
    }
    setSession(session)
  })

  return (
    <>
      {!session() ? (
        <Login />
      ) : (
        <AuthProvider session={session()!}>
          {needsNewPassword() ? (
            <div>
              <span class="block text-bold text-red-600">
                Password must be updated
              </span>
              <UserSecurity />
            </div>
          ) : (
            props.children
          )}
        </AuthProvider>
      )}
      {/* <pre>{JSON.stringify(session(), null, 2)}</pre> */}
    </>
  )
}

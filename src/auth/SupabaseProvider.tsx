import {
  type AuthChangeEvent,
  type AuthSession,
  type InitializeResult,
} from '@supabase/supabase-js'
import {
  createContext,
  createEffect,
  onCleanup,
  useContext,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { type AppSupabaseClient } from './supabase'

export const SupabaseContext = createContext<AppSupabaseClient>()
export const AuthContext = createContext<AuthSession>()

interface Props {
  client: AppSupabaseClient
  children?: JSX.Element
}

export function SupabaseProvider(
  props: ParentProps<{
    client: AppSupabaseClient
  }>,
): JSX.Element {
  return (
    <SupabaseContext.Provider value={props.client}>
      {props.children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase(): AppSupabaseClient {
  const ctx = useContext(SupabaseContext)

  if (!ctx)
    throw new Error(
      'useSupabase must be used within a SupabaseContext.Provider',
    )

  return ctx
}

export function AuthProvider(
  props: ParentProps<{
    session: AuthSession
    children?: JSX.Element
  }>,
): JSX.Element {
  return (
    <AuthContext.Provider value={props.session}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthSession {
  const ctx = useContext(AuthContext)

  if (!ctx)
    throw new Error('useAuth must be used within a AuthContext.Provider')

  return ctx
}

export function useAuthInit(fn: (r: InitializeResult) => void): void {
  const supabase = useSupabase()
  createEffect(async () => {
    const result = await supabase.auth.initialize()
    fn(result)
  })
}

export function useAuthStateChange(
  fn: (event: AuthChangeEvent | 'INIT', session: AuthSession | null) => void,
  options: {
    autoDispose?: boolean
  } = { autoDispose: true },
): void {
  const supabase = useSupabase()

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      fn(event, session)
    },
  )

  createEffect(async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) fn('SIGNED_IN', data.session)
  })

  onCleanup(() => {
    if (options.autoDispose) authListener.subscription.unsubscribe()
  })
}

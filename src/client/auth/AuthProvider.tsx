import { createContext, type JSX, type ParentProps, useContext } from 'solid-js'
import {
  type Auth0Client,
  GetTokenSilentlyOptions,
  type User,
} from '@auth0/auth0-spa-js'
import { createStore } from 'solid-js/store'
import config from '../config'

export type AuthUser = User

interface AuthStore {
  hasInitialized: boolean
  user: AuthUser | null
  token: string | null
}

interface AuthContextProps {
  store: AuthStore
  init: () => Promise<void>
  login: () => void
  logout: () => void
}

const authConfig: GetTokenSilentlyOptions = {
  authorizationParams: { audience: config.auth0.audience },
}

export const AuthContext = createContext<AuthContextProps>()

export function AuthProvider(
  props: ParentProps<{
    client: Auth0Client
  }>,
): JSX.Element {
  const [store, setStore] = createStore<AuthStore>({
    hasInitialized: false,
    user: null,
    token: null,
  })

  async function init() {
    // console.log('auth', store.hasInitialized)
    if (store.hasInitialized) return

    try {
      const token = await props.client.getTokenSilently(authConfig)
      // console.log('auth done', store.hasInitialized, token)
      setStore({ token })
    } catch (error: any) {
      console.log('auth error', error)
      setStore({ hasInitialized: true })
      if (error.error !== 'login_required') {
        // return props.client.loginWithRedirect()
        throw error
      }
    }

    const user = await props.client.getUser()
    setStore({ hasInitialized: true, user })
  }

  const result = {
    store,
    init,
    login: () => props.client.loginWithRedirect(authConfig),
    logout: () => {
      props.client.logout()
      setStore({ user: null, token: null })
    },
  }

  return (
    <AuthContext.Provider value={result}>{props.children}</AuthContext.Provider>
  )
}

export function useAuth(): AuthContextProps {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within a AuthUserContext.Provider')
  }

  return ctx
}

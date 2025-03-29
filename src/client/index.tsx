/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'
import { auth0 } from './auth/auth0'
import { AuthProvider } from './auth/AuthProvider'

import App from './root/App'

render(
  () => (
    <AuthProvider client={auth0}>
      <App />
    </AuthProvider>
  ),
  document.getElementById('root') as HTMLElement,
)

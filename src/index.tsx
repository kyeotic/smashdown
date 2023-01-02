/* @refresh reload */
import './index.css'
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import { supabase } from './auth/supabase'
import { SupabaseProvider } from './auth/SupabaseProvider'

import App from './root/App'

render(
  () => (
    <Router>
      <SupabaseProvider client={supabase}>
        <App />
      </SupabaseProvider>
    </Router>
  ),
  document.getElementById('root') as HTMLElement,
)

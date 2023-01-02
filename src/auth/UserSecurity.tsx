import {
  createSignal,
  onMount,
  createEffect,
  createRenderEffect,
  type JSX,
} from 'solid-js'
import { TextInput } from '../components/Forms'
import { useSupabase, useAuth } from './SupabaseProvider'
import { createFormGroup, createFormControl } from 'solid-forms'
import { Button } from '../components'

export default function UserSecurity() {
  const supabase = useSupabase()
  const auth = useAuth()

  const form = createFormGroup({
    password: createFormControl('', {
      validators: [passwordMinLength],
    }),
    password2: createFormControl('', {
      validators: [passwordMinLength],
    }),
  })

  createRenderEffect(() => {
    const password = form.controls.password.value
    const password2 = form.controls.password2.value
    if (password?.length && password?.length && password !== password2) {
      form.controls.password2.setErrors({ mustMatch: 'passwords must match' })
    }
  })

  async function updatePassword(e: Event) {
    e.preventDefault()
    const password = form.controls.password.value

    await supabase.auth.updateUser({ password }).catch((e) => {
      console.error('user update failure', e)
    })

    form.controls.password.setValue('')
    form.controls.password2.setValue('')
  }

  createEffect(() => {
    console.log('user', auth.user.email)
  })

  return (
    <div>
      <TextInput
        label="Email"
        control={createFormControl(auth.user.email)}
        disabled
      />
      <form onsubmit={updatePassword}>
        <TextInput
          label="Password"
          control={form.controls.password}
          type="password"
        />
        <TextInput
          label="Repeat Password"
          control={form.controls.password2}
          type="password"
        />
        <Button primary type="submit" disabled={!form.isValid}>
          Update Password
        </Button>
      </form>
    </div>
  )
}

function passwordMinLength(pass: string) {
  if (!pass || pass.length < 8)
    return { minLength: 'Must be at least 8 characters' }
  return null
}

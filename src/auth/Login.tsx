import { createFormControl, createFormGroup } from 'solid-forms'
import { createSignal, JSX, onMount } from 'solid-js'
import { Button } from '../components'
import { TextInput } from '../components/Forms'
import { supabase } from './supabase'

export default function Auth(): JSX.Element {
  const [loading, setLoading] = createSignal(false)
  const form = createFormGroup({
    email: createFormControl('', {
      validators: [
        (raw: string) =>
          raw.length ? null : { required: 'Email is Required' },
      ],
    }),
    password: createFormControl('', {
      validators: [
        (raw: string) =>
          raw.length ? null : { required: 'Password is Required' },
      ],
    }),
  })

  // onMount(() => {
  //   if (!window.location.hash.includes('access_token')) return

  //   supabase.auth.
  // })

  async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    })
    console.log('discord', data, error)
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()

    const email = form.controls.email.value
    const password = form.controls.password.value
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="mx-auto">
      <form
        class="my-5 flex-col flex-center flex items-center"
        onSubmit={submit}
      >
        <TextInput
          label="Email"
          type="email"
          name="email"
          placeholder="flow@chart.com"
          control={form.controls.email}
        />
        <TextInput
          label="Password"
          type="password"
          name="password"
          control={form.controls.password}
        />
        <Button type="submit" class="my-4">
          {loading() ? <span>Loading</span> : <span>Login</span>}
        </Button>
      </form>
    </div>
  )
}

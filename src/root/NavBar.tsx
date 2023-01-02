import { A } from '@solidjs/router'
import { USER_SECURITY } from './routes'

export default function NavBar() {
  return (
    <nav
      class={`
      px-8 flex-none h-12
      flex gap-1 w-full justify-between items-center
      text-white drop-shadow-md
      bg-gradient-to-r from-cyan-500 to-blue-500 py-1
    `}
    >
      <A href="/" class="flex gap-2 justify-center items-center">
        <img
          class="flex-0 h-7 object-cover"
          src="/apple-touch-icon.png"
          alt="home"
        />
        <span class="flex-0 font-bold text-xl">Home</span>
      </A>
      <A href={USER_SECURITY}>
        <i class="fa-solid fa-user pr-2" />
        <span class="flex-0 font-bold">Profile</span>
      </A>
    </nav>
  )
}

import { A } from '@solidjs/router'

export default function NavBar() {
  return (
    <nav
      class={`flex gap-1 h-8 w-full justify-center items-center
      text-white drop-shadow-md
      bg-gradient-to-r from-cyan-500 to-blue-500 py-1
    `}
    >
      <A href="/" class="contents">
        <img
          class="flex-0 h-7 object-cover"
          src="/apple-touch-icon.png"
          alt="home"
        />
        <span class="flex-0 font-bold text-xl">Home</span>
      </A>
    </nav>
  )
}

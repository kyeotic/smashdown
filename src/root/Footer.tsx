import { A } from '@solidjs/router'

export default function Footer() {
  return (
    <div class="flex gap-1 h-8 w-full justify-center items-center text-white bg-black">
      <A class="contents" href="/util">
        Utilities
      </A>
    </div>
  )
}

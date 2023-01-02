import { Button, TextInput as Input } from '../components'
import { useTournamentStore } from '../tournaments/context'
import { useTournamentsClassic } from '../tournaments/hooks'
import { toast } from 'solid-toast'

export default function DataUtilities() {
  const [tournaments, isLoading] = useTournamentsClassic()
  const store = useTournamentStore()

  async function importLocal() {
    if (isLoading()) return

    for (const [id, t] of Object.entries(tournaments()!)) {
      try {
        const n = await store.create(t)
        t.id = n.id
        await store.update(t)
        toast('import complete')
      } catch (e: any) {
        toast.error(e.message)
      }
    }
  }

  return (
    <div class="">
      <div class="flex gap-4 justify-start my-4">
        <Button onClick={importLocal}>Import From Local</Button>
      </div>
    </div>
  )
}

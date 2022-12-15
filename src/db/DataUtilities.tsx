import db, { type DbTournaments } from './local'
import { createResource, createSignal } from 'solid-js'
import { useSearchParams, useNavigate } from '@solidjs/router'
import { onMount } from 'solid-js'
import { Button, TextInput } from '../components'
import clipboard from 'copy-to-clipboard'

export default function DataUtilities() {
  const navigate = useNavigate()
  const [dbRaw, { refetch }] = createResource(getRawUrl)
  const [query] = useSearchParams()

  onMount(() => {
    if (query.raw) {
      db.tournaments.saveRaw(decode(query.raw)).then(() => {
        navigate('/')
      })
      return
    }
  })

  function createShareUrl(): string {
    const url = new URL(`/util`, window.location.origin)
    url.searchParams.set('raw', dbRaw()!)
    return url.toString()
  }

  function copy() {
    clipboard(createShareUrl())
  }

  return (
    <div class="">
      <TextInput disabled value={createShareUrl()} />
      <Button onclick={copy} class="mt-4">
        Copy
      </Button>
    </div>
  )
}

async function getRawUrl(): Promise<string> {
  const raw = await db.tournaments.getRaw()
  return encode(raw)
}

function decode(raw: string): DbTournaments {
  return JSON.parse(atob(raw)) as DbTournaments
}

function encode(tourneys: DbTournaments): string {
  return btoa(JSON.stringify(tourneys))
}

function iosCopyToClipboard(el: any) {
  var oldContentEditable = el.contentEditable,
    oldReadOnly = el.readOnly,
    range = document.createRange()

  el.contentEditable = true
  el.readOnly = false
  range.selectNodeContents(el)

  var s = window.getSelection()!
  s.removeAllRanges()
  s.addRange(range)

  el.setSelectionRange(0, 999999) // A big number, to cover anything that could be inside the element.

  el.contentEditable = oldContentEditable
  el.readOnly = oldReadOnly

  try {
    document.execCommand('copy')
  } catch (e) {
    console.error(e)
  }
}

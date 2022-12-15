import db, { type DbTournaments } from './local'
import { createEffect, createResource, createSignal } from 'solid-js'
import { useSearchParams, useNavigate } from '@solidjs/router'
import { onMount } from 'solid-js'
import { Button, TextInput as Input } from '../components'
import { TextInput } from '../components/Forms'
import clipboard from 'copy-to-clipboard'
import { createFormControl, createFormGroup } from 'solid-forms'

export default function DataUtilities() {
  const navigate = useNavigate()
  const [exportTxt, setExport] = createSignal('')
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

  createEffect(() => {
    if (dbRaw()) setUrl()
  })

  function createShareUrl(): string {
    const url = new URL(`/util`, window.location.origin)
    url.searchParams.set('raw', dbRaw()!)
    return url.toString()
  }

  function copy() {
    clipboard(exportTxt())
  }

  function setUrl() {
    setExport(createShareUrl())
  }

  function setRaw() {
    setExport(dbRaw()!)
  }

  return (
    <div class="">
      <div class="flex gap-4 justify-start my-4">
        <Button onClick={setUrl}>Export URL</Button>
        <Button onClick={setRaw}>Export Raw</Button>
      </div>

      <Input disabled value={exportTxt()} />
      <Button onclick={copy} class="mt-4">
        Copy
      </Button>
      <ImportForm />
    </div>
  )
}

function ImportForm() {
  const navigate = useNavigate()
  const form = createFormGroup({
    raw: createFormControl(''),
  })

  async function submit(e: Event) {
    e.preventDefault()
    const raw = form.value.raw!

    db.tournaments.saveRaw(decode(raw)).then(() => {
      navigate('/')
    })
  }

  return (
    <form onsubmit={submit} class="py-8">
      <TextInput label="Import Raw" control={form.controls.raw} />

      <Button type="submit" primary>
        Import
      </Button>
    </form>
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

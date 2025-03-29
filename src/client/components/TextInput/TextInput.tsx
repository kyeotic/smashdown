import { Show, splitProps } from 'solid-js'
import classnames from 'classnames'

import Label from '../Label/Label'

import type { JSX } from 'solid-js'

export default function TextInput(
  props: JSX.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    labelClass?: string
  },
) {
  let [local, rest] = splitProps(props, [
    'class',
    'label',
    'labelClass',
    'type',
    'id',
  ])
  return (
    <div>
      <Show when={local.label}>
        <Label for={local.id} class={local.labelClass}>
          {local.label}
        </Label>
      </Show>
      <input
        {...rest}
        id={local.id}
        type={local.type ?? 'text'}
        class={classnames(
          local.class,
          'shadow-sm appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline',
        )}
      />
    </div>
  )
}

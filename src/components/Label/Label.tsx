import { type JSX, type ParentProps } from 'solid-js'
import classnames from 'classnames'

export default function Label(
  props: ParentProps & {
    id?: string
    class?: string
    for?: string
  },
): JSX.Element {
  return (
    <label
      for={props.id}
      class={classnames(
        'block text-gray-700 text-sm font-bold mb-2',
        props.class,
      )}
    >
      {props.children}
    </label>
  )
}

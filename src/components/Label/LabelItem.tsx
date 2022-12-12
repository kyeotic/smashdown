import { type JSX, type ParentProps } from 'solid-js'
import classnames from 'classnames'

export default function LabelItem(
  props: ParentProps & {
    label: string
    labelClass?: string
    text: string
    textClass?: string
  },
): JSX.Element {
  return (
    <div>
      <label
        class={classnames(
          'block text-gray-700 text-sm font-bold mb-2',
          props.labelClass,
        )}
      >
        {props.children}
      </label>
      <span class={props.textClass}>{props.text}</span>
    </div>
  )
}

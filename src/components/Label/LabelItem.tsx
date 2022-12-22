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
    <div class="flex gap-2 w-full mb-2">
      <label
        class={classnames('text-gray-700 text-sm font-bold', props.labelClass)}
      >
        {props.label}
      </label>
      <span class={classnames('text-gray-700 text-sm', props.textClass)}>
        {props.text}
      </span>
    </div>
  )
}

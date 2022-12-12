import { type JSX, splitProps, mergeProps } from 'solid-js'
import classnames from 'classnames'

export function buttonStyle(
  props: { primary?: boolean } = { primary: false },
): string {
  return classnames(
    'text-white font-bold py-2 px-4 rounded',
    props.primary
      ? 'bg-green-600 hover:bg-blue-700'
      : 'bg-slate-200 hover:bg-slate-700',
  )
}

export default function Button(
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean },
): JSX.Element {
  let [local, rest] = splitProps(mergeProps({ type: 'button' }, props), [
    'class',
    'primary',
  ])
  return (
    <button {...rest} class={classnames(local.class, buttonStyle(local))} />
  )
}

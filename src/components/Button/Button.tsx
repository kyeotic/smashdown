import { type JSX, splitProps, mergeProps } from 'solid-js'
import classnames from 'classnames'

export function buttonStyle(
  props: { primary?: boolean; danger?: boolean } = {
    primary: false,
    danger: false,
  },
): string {
  return classnames(
    'text-white font-bold py-2 px-4 rounded',
    props.danger
      ? 'bg-red-400 hover:bg-red-700'
      : props.primary
      ? 'bg-green-600 hover:bg-blue-700'
      : 'bg-slate-400 hover:bg-slate-700',
  )
}

export default function Button(
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    primary?: boolean
    danger?: boolean
  },
): JSX.Element {
  let [local, rest] = splitProps(
    mergeProps(
      { type: 'button' as JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'] },
      props,
    ),
    ['class', 'primary', 'danger'],
  )
  return (
    <button {...rest} class={classnames(local.class, buttonStyle(local))} />
  )
}

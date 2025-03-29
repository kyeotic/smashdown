import classnames from 'classnames'
import { splitProps, type JSX, type ParentProps } from 'solid-js'

const headerBase = 'font-semibold mb-3'

export function H1(props: ParentProps & { class?: string }): JSX.Element {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <h1 class={classnames(local.class, 'text-4xl', headerBase)} {...rest} />
  )
}

export function H2(props: ParentProps & { class?: string }): JSX.Element {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <h2 class={classnames(local.class, 'text-3xl', headerBase)} {...rest} />
  )
}

export function H3(props: ParentProps & { class?: string }): JSX.Element {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <h3 class={classnames(local.class, 'text-2xl', headerBase)} {...rest} />
  )
}

export function H4(props: ParentProps & { class?: string }): JSX.Element {
  const [local, rest] = splitProps(props, ['class'])
  return <h4 class={classnames(local.class, 'text-xl', headerBase)} {...rest} />
}

export function H5(props: ParentProps & { class?: string }): JSX.Element {
  const [local, rest] = splitProps(props, ['class'])
  return <h5 class={classnames(local.class, 'text-lg', headerBase)} {...rest} />
}

export function H6(props: ParentProps & { class?: string }): JSX.Element {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <h6 class={classnames(local.class, 'text-base', headerBase)} {...rest} />
  )
}

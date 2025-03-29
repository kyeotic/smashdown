import { type JSX, type ParentProps } from 'solid-js'
import { Portal } from 'solid-js/web'

export const MODAL_ROOT_ID = 'modal-root'

export default function Modal(
  props: ParentProps & { onClose?: () => void },
): JSX.Element {
  const root = document.getElementById(MODAL_ROOT_ID)
  if (!root) throw new Error(`Modal node "${MODAL_ROOT_ID}" is not in the DOM`)
  return (
    <Portal mount={root}>
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div>{props.children}</div>
      </div>
    </Portal>
  )
}

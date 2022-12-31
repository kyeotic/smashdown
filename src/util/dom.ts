export function scrollToCenter(
  el: HTMLElement,
  { smooth = true }: { smooth?: boolean } = {},
) {
  el.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'center',
    inline: 'center',
  })
}

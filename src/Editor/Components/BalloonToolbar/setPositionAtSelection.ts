export const setPositionAtSelection = (el: HTMLElement, direction: 'top' | 'bottom' = 'top') => {
  const domSelection = window.getSelection()
  if (!domSelection || domSelection.rangeCount < 0) return

  const domRange = domSelection.getRangeAt(0)
  const rect = domRange.getBoundingClientRect()

  if (el.offsetHeight === 0) {
    el.style.visibility = 'hidden'
  }

  setTimeout(() => {
    let top: string
    if (direction === 'top') {
      top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    } else {
      top = `${rect.bottom + window.pageYOffset}px`
    }
    const left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`

    el.style.top = top
    el.style.left = left
    el.style.visibility = 'inherit'
  }, 20)
}

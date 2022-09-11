/* eslint-disable @typescript-eslint/no-explicit-any */
const toggleWindow = (window: any, isSelection: boolean) => {
  if (!isSelection && (window.isFocused() || window.isVisible())) {
    window.hide()
    return
  }

  window.show()
}

export { toggleWindow }

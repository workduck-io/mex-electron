import React from 'react'
import useThemeStore from '../Editor/Store/ThemeStore'
import { useLayoutStore } from './LayoutStore'

const useLayout = () => {
  const toggleFocusModeBool = useLayoutStore((store) => store.toggleFocusMode)
  const showInfobar = useLayoutStore((store) => store.showInfobar)
  const hideInfobar = useLayoutStore((store) => store.hideInfobar)

  const toggleFocusMode = () => {
    if (useLayoutStore.getState().focusMode) {
      toggleFocusModeBool()
      showInfobar()
    } else {
      toggleFocusModeBool()
      hideInfobar()
    }
  }

  return { toggleFocusMode }
}

export default useLayout

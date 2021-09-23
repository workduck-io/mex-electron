import React from 'react'
import useThemeStore from '../Editor/Store/ThemeStore'
import { useLayoutStore } from './LayoutStore'

const useLayout = () => {
  const toggleSidebarBool = useLayoutStore((store) => store.toggleSidebar)
  const showInfobar = useLayoutStore((store) => store.showInfobar)
  const hideInfobar = useLayoutStore((store) => store.hideInfobar)

  const toggleSidebar = () => {
    if (useLayoutStore.getState().sidebar.visible) {
      toggleSidebarBool()
      hideInfobar()
    } else {
      toggleSidebarBool()
      showInfobar()
    }
  }

  return { toggleSidebar }
}

export default useLayout

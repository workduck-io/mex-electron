import { InfobarMode, useLayoutStore } from '../store/useLayoutStore'

const useToggleElements = () => {
  const setInfobarMode = useLayoutStore((store) => store.setInfobarMode)
  const setRHSidebarExpanded = useLayoutStore((store) => store.setRHSidebarExpanded)

  const changeSidebarExpand = () => {
    const rhSidebar = useLayoutStore.getState().rhSidebar
    if (rhSidebar.show && !rhSidebar.expanded) {
      setRHSidebarExpanded(true)
    }
  }

  const toggleMode = (mode: InfobarMode, notToggle?: boolean) => {
    const infobar = useLayoutStore.getState().infobar
    changeSidebarExpand()
    if (infobar.mode === mode && !notToggle) {
      setInfobarMode('default')
    } else {
      setInfobarMode(mode)
    }
  }

  const toggleGraph = () => {
    toggleMode('graph')
  }

  const toggleSyncBlocks = () => {
    toggleMode('flow')
  }

  const toggleSnippets = () => {
    toggleMode('snippets')
  }

  const toggleReminder = () => {
    toggleMode('reminders', true)
  }

  return {
    toggleSnippets,
    toggleGraph,
    toggleSyncBlocks,
    toggleReminder
  }
}

export default useToggleElements

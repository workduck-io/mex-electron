import { InfobarMode, useLayoutStore } from '../store/useLayoutStore'

const useToggleElements = () => {
  const infobar = useLayoutStore((state) => state.infobar)
  const setInfobarMode = useLayoutStore((store) => store.setInfobarMode)

  const toggleMode = (mode: InfobarMode) => {
    if (infobar.mode === mode) {
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

  const toggleSuggestedNodes = () => {
    toggleMode('suggestions')
  }

  const toggleReminder = () => {
    toggleMode('reminders')
  }

  return {
    toggleSuggestedNodes,
    toggleGraph,
    toggleSyncBlocks,
    toggleReminder
  }
}

export default useToggleElements

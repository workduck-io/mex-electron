import { useContentStore } from '../store/useContentStore'
import { useGraphStore } from '../store/useGraphStore'

const useToggleElements = () => {
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraphElement = useGraphStore((state) => state.toggleGraph)
  const showSyncBlocks = useContentStore((state) => state.showSyncBlocks)
  const toggleSyncBlockElements = useContentStore((state) => state.toggleSyncBlocks)
  const showSuggestedNodes = useContentStore((store) => store.showSuggestedNodes)
  const toggleSuggestedNodeInfoBar = useContentStore((store) => store.toggleSuggestedNodes)

  const toggleGraph = () => {
    if (showSyncBlocks) toggleSyncBlockElements()
    if (showSuggestedNodes) toggleSuggestedNodeInfoBar()
    toggleGraphElement()
  }

  const toggleSyncBlocks = () => {
    if (showGraph) toggleGraphElement()
    if (showSuggestedNodes) toggleSuggestedNodeInfoBar()
    toggleSyncBlockElements()
  }

  const toggleSuggestedNodes = () => {
    if (showGraph) toggleGraphElement()
    if (showSyncBlocks) toggleSyncBlocks()
    toggleSuggestedNodeInfoBar()
  }

  return { showGraph, showSyncBlocks, showSuggestedNodes, toggleSuggestedNodes, toggleGraph, toggleSyncBlocks }
}

export default useToggleElements

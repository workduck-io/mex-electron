import { useContentStore } from './../../Editor/Store/ContentStore'
import { useGraphStore } from '../../Components/Graph/GraphStore'

const useToggleElements = () => {
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraphElement = useGraphStore((state) => state.toggleGraph)
  const showSyncBlocks = useContentStore((state) => state.showSyncBlocks)
  const toggleSyncBlockElements = useContentStore((state) => state.toggleSyncBlocks)

  const toggleGraph = () => {
    if (showSyncBlocks) toggleSyncBlockElements()
    toggleGraphElement()
  }

  const toggleSyncBlocks = () => {
    if (showGraph) toggleGraphElement()
    toggleSyncBlockElements()
  }

  return { showGraph, showSyncBlocks, toggleGraph, toggleSyncBlocks }
}

export default useToggleElements

import useInfoBarStore from '../store/useInfoBarStore'

const useToggleElements = () => {
  const infoStore = useInfoBarStore()

  const toggleGraph = () => {
    if (infoStore.showFlowBlocks) infoStore.toggleFlowBlocks()
    if (infoStore.showSuggestions) infoStore.toggleSuggestions()
    infoStore.toggleGraph()
  }

  const toggleSyncBlocks = () => {
    if (infoStore.showGraph) infoStore.toggleFlowBlocks()
    if (infoStore.showSuggestions) infoStore.toggleSuggestions()
    infoStore.toggleFlowBlocks()
  }

  const toggleSuggestedNodes = () => {
    if (infoStore.showGraph) infoStore.toggleGraph()
    if (infoStore.showFlowBlocks) infoStore.toggleFlowBlocks()
    infoStore.toggleSuggestions()
  }

  const toggleShare = () => {
    if (infoStore.showBlockView) infoStore.setBlockView(false)
    infoStore.toggleShare()
  }

  return {
    showGraph: infoStore.showGraph,
    showSyncBlocks: infoStore.showFlowBlocks,
    showSuggestedNodes: infoStore.showSuggestions,
    isBlockView: infoStore.showBlockView,
    showShare: infoStore.showShare,
    toggleSuggestedNodes,
    setBlockView: infoStore.setBlockView,
    toggleGraph,
    toggleSyncBlocks,
    toggleShare
  }
}

export default useToggleElements

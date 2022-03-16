import create from 'zustand'
import useBlockStore from './useBlockStore'

interface InfoBarStoreType {
  showFlowBlocks: boolean
  toggleFlowBlocks: () => void
  showSuggestions: boolean
  toggleSuggestions: () => void
  showGraph: boolean
  toggleGraph: () => void
  showShare: boolean
  toggleShare: () => void
  showBlockView: boolean
  setBlockView: (isBlockView: boolean) => void
}

const useInfoBarStore = create<InfoBarStoreType>((set, get) => ({
  showFlowBlocks: false,
  showSuggestions: false,
  showGraph: false,
  showShare: false,
  showBlockView: false,
  toggleFlowBlocks: () => set({ showFlowBlocks: !get().showFlowBlocks }),
  toggleSuggestions: () => set({ showSuggestions: !get().showSuggestions }),
  toggleGraph: () => set({ showGraph: !get().showGraph }),
  toggleShare: () => set({ showShare: !get().showShare }),
  setBlockView: (isBlockView: boolean) => {
    if (!isBlockView) useBlockStore.getState().setBlocks({})
    set(() => ({ showBlockView: isBlockView, showShare: false }))
  }
}))

export default useInfoBarStore

import create from 'zustand'

interface GraphStoreState {
  showTools: boolean
  showGraph: boolean
  showLocal: boolean
  showNodePreview: boolean

  setNodePreview: (show: boolean) => void
  toggleTools: () => void
  toggleGraph: () => void
  toggleLocal: () => void
}

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  showTools: true,
  showGraph: false,
  showLocal: true,
  showNodePreview: false,

  setNodePreview: (show) => set({ showNodePreview: show }),

  toggleTools: () =>
    set((state) => ({
      showTools: !state.showTools
    })),

  toggleGraph: () =>
    set((state) => ({
      showGraph: !state.showGraph
    })),

  toggleLocal: () =>
    set((state) => ({
      showLocal: !state.showLocal
    }))
}))

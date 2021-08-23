import create from 'zustand'

interface GraphStoreState {
  showTools: boolean
  showGraph: boolean
  showLocal: boolean
  toggleTools: () => void
  toggleGraph: () => void
  toggleLocal: () => void
}

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  showTools: true,
  showGraph: false,
  showLocal: false,

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

import create from 'zustand'

interface GraphStoreState {
  showTools: boolean
  showGraph: boolean
  showLocal: boolean
  selectedNode?: any
  showServices: boolean
  showNodePreview: boolean
  serviceNodes: any[]

  toggleTools: () => void
  toggleGraph: () => void
  toggleLocal: () => void
  toggleServiceNodes: () => void
  setSelectedNode: (node: any) => void
  addServiceNode: (service: any) => void
  setNodePreview: (show: boolean) => void
  setServiceNodes: (services: any[]) => void
}

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  showTools: true,
  showGraph: true,
  showLocal: true,
  serviceNodes: [],
  showServices: true,
  showNodePreview: false,

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
    })),
  toggleServiceNodes: () => set({ showServices: !get().showServices }),
  setServiceNodes: (services) => set({ serviceNodes: services }),
  addServiceNode: (service: any) => {
    const services = get().serviceNodes

    set({ serviceNodes: [...services, service] })
  },
  setSelectedNode: (node) => set({ selectedNode: node }),
  setNodePreview: (show) => set({ showNodePreview: show })
}))

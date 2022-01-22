import create from 'zustand'

interface NodeSelectStore {
  items: string[]
  setItems: (items: string[]) => void
}

export const useNodeSelectStore = create<NodeSelectStore>((set, get) => ({
  items: [],
  setItems: (items: string[]) => set({ items })
}))

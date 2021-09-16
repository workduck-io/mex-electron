import create from 'zustand'

export type SpotlightAppStore = {
  search: string
  setSearch: (value: string) => void
  reset: boolean
  setReset: () => void
}

export const useSpotlightAppStore = create<SpotlightAppStore>((set, get) => ({
  reset: false,
  search: '',
  setSearch: (value) => set({ search: value }),
  setReset: () => set({ reset: !get().reset })
}))

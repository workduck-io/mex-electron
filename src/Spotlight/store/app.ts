import create from 'zustand'

export type SpotlightAppStore = {
  search: string
  setSearch: (value: string) => void
  normalMode: boolean
  setNormalMode: (value: boolean) => void
  reset: boolean
  setReset: () => void
}

export const useSpotlightAppStore = create<SpotlightAppStore>((set, get) => ({
  reset: false,
  search: '',
  normalMode: true,
  setNormalMode: (value: boolean) => set(() => ({ normalMode: value })),
  setSearch: (value) => set({ search: value }),
  setReset: () => set({ reset: !get().reset })
}))

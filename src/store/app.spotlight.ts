import create from 'zustand'

export type SpotlightAppStore = {
  search: string
  setSearch: (value: string) => void
  normalMode: boolean
  setNormalMode: (value: boolean) => void
  reset: boolean
  input: string
  setInput: (value: string) => void
  setReset: () => void
}

export const useSpotlightAppStore = create<SpotlightAppStore>((set, get) => ({
  reset: false,
  search: '',
  normalMode: true,
  input: '',
  setInput: (value: string) => set({ input: value }),
  setNormalMode: (value: boolean) => set(() => ({ normalMode: value })),
  setSearch: (value) => set({ search: value }),
  setReset: () => set({ reset: !get().reset, normalMode: true })
}))

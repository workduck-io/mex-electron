import create from 'zustand'

export type SpotlightAppStore = {
  search: string
  setSearch: (value: string) => void
  normalMode: boolean
  setNormalMode: (value: boolean) => void
  input: string
  setInput: (value: string) => void
  reset: boolean
  setReset: () => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

export const useSpotlightAppStore = create<SpotlightAppStore>((set, get) => ({
  input: '',
  setInput: (value: string) => set({ input: value }),

  // Mode for list if false, the editor takes full screen

  normalMode: true,
  setNormalMode: (value: boolean) => set(() => ({ normalMode: value })),

  search: '',
  setSearch: (value) => set({ search: value }),

  reset: false,
  setReset: () => set({ reset: !get().reset, normalMode: true }),

  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value })
}))

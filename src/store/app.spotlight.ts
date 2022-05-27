import create from 'zustand'

export type ViewType = 'item' | 'form' | undefined

export type ViewDataType = { context: any; display: any }

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

  search: '',
  setSearch: (value) => set({ search: value }),

  normalMode: true,
  setNormalMode: (value: boolean) => set(() => ({ normalMode: value })),

  reset: false,
  setReset: () => set({ reset: !get().reset, normalMode: true }),

  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value })
}))

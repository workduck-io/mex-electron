import create from 'zustand'

export type ViewType = 'item' | 'form' | undefined

export type ViewDataType = { context: any; display: any }

export type SpotlightAppStore = {
  search: string
  setSearch: (value: string) => void
  normalMode: boolean
  setNormalMode: (value: boolean) => void
  viewData: ViewDataType
  setViewData: (value: ViewDataType) => void
  input: string
  setInput: (value: string) => void
  reset: boolean
  setReset: () => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  view?: ViewType
  setView: (value: ViewType) => void
  isMenuOpen: boolean
  setIsMenuOpen: (value: boolean) => void
}

export const useSpotlightAppStore = create<SpotlightAppStore>((set, get) => ({
  input: '',
  setInput: (value: string) => set({ input: value }),

  // Mode for list if false, the editor takes full screen
  isMenuOpen: false,
  setIsMenuOpen: (value: boolean) => set({ isMenuOpen: value }),

  normalMode: true,
  setNormalMode: (value: boolean) => set(() => ({ normalMode: value })),

  viewData: undefined,
  setViewData: (value: ViewDataType) => set({ viewData: value }),

  setView: (value: ViewType) => set({ view: value }),

  search: '',
  setSearch: (value) => set({ search: value }),

  reset: false,
  setReset: () => set({ reset: !get().reset, normalMode: true, view: undefined }),

  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value })
}))

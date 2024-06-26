import create from 'zustand'

export type ViewType = 'item' | 'form' | undefined

export type ViewDataType = { context: any; display: any }

export type SpotlightAppStore = {
  search: string
  setSearch: (value: string) => void
  normalMode: boolean
  setNormalMode: (value: boolean) => void
  // Save after window blur?
  // If false it is reset to true after the window is blurred
  // without saving on blur
  saveAfterBlur: boolean
  setSaveAfterBlur: (value: boolean) => void
  input: string
  setInput: (value: string) => void
  reset: boolean
  setReset: () => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  configurationChanged?: boolean
  toggleConfigurationChanged: () => void
}

export const useSpotlightAppStore = create<SpotlightAppStore>((set, get) => ({
  input: '',
  setInput: (value: string) => set({ input: value }),

  configurationChanged: false,
  toggleConfigurationChanged: () => set({ configurationChanged: !get().configurationChanged }),

  search: '',
  setSearch: (value) => set({ search: value }),

  normalMode: true,
  setNormalMode: (value: boolean) => set(() => ({ normalMode: value })),

  saveAfterBlur: true,
  setSaveAfterBlur: (value: boolean) => set(() => ({ saveAfterBlur: value })),

  reset: false,
  setReset: () => set({ reset: !get().reset, normalMode: true }),

  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value })
}))

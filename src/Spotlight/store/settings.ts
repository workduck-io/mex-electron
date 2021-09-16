import create from 'zustand'

export type SpotlightSettingsType = {
  showSource: boolean
  bubble: boolean
  backPressed: boolean
  setBackPressed: (back: boolean) => void
  setBubble: () => void
  toggleSource: (checked: boolean) => void
  initSpotlightSettings: (settings: any) => void
}

export const useSpotlightSettingsStore = create<SpotlightSettingsType>((set, get) => ({
  showSource: true,
  bubble: false,
  backPressed: false,
  setBackPressed: (back) => set({ backPressed: back }),
  setBubble: () => set({ bubble: !get().bubble }),
  toggleSource: (checked: boolean) => set(() => ({ showSource: checked })),
  initSpotlightSettings: (settings) => {
    set(() => ({
      showSource: settings.showSource,
    }))
  },
}))

import create from 'zustand'

export type SpotlightSettingsType = {
  showSource: boolean
  bubble: boolean
  setBubble: () => void
  toggleSource: (checked: boolean) => void
  initSpotlightSettings: (settings: any) => void
}

export const useSpotlightSettingsStore = create<SpotlightSettingsType>((set, get) => ({
  showSource: true,
  bubble: false,
  setBubble: () => set({ bubble: !get().bubble }),
  toggleSource: (checked: boolean) => set(() => ({ showSource: checked })),
  initSpotlightSettings: (settings) => {
    set(() => ({
      showSource: settings.showSource
    }))
  }
}))

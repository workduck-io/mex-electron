import create from 'zustand'

export type SpotlightSettingsType = {
  showSource: boolean
  bubble: boolean
  setBubble: () => void
  toggleSource: (checked: boolean) => void
  initSpotlightSettings: (settings: any) => void
  spotlightTrigger: boolean
  setSpotlightTrigger: () => void
}

export const useSpotlightSettingsStore = create<SpotlightSettingsType>((set, get) => ({
  showSource: true,
  bubble: false,
  setBubble: () => set({ bubble: !get().bubble }),
  toggleSource: (checked: boolean) => set(() => ({ showSource: checked })),
  spotlightTrigger: false,
  setSpotlightTrigger: () => set({ spotlightTrigger: !get().spotlightTrigger }),
  initSpotlightSettings: (settings) => {
    set(() => ({
      showSource: settings.showSource
    }))
  }
}))

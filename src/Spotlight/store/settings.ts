import create from 'zustand'

export type SpotlightSettingsType = {
  showSource: boolean
  toggleSource: (checked: boolean) => void
  initSpotlightSettings: (settings: any) => void
}

export const useSpotlightSettingsStore = create<SpotlightSettingsType>((set, get) => ({
  showSource: false,
  toggleSource: (checked: boolean) => set(() => ({ showSource: checked })),
  initSpotlightSettings: (settings) => {
    set(() => ({
      showSource: settings.showSource
    }))
  }
}))

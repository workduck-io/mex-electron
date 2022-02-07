import create from 'zustand'
// import { useDataSaverFromContent } from '../editor/Components/Saver'

interface VersionStore {
  version: string | undefined
  setVersion: (version: string) => void
}

export const useVersionStore = create<VersionStore>((set) => ({
  version: undefined,
  setVersion: (version: string) => set({ version })
}))

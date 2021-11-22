import create from 'zustand'
import { SyncBlockTemplate } from '../Components/SyncBlock'

export type IntegrationStore = {
  template?: SyncBlockTemplate
  selectTemplate: (template: SyncBlockTemplate) => void
  templateDetails?: any[]
  setTemplateDetails: (details: any[]) => void
}

export const useIntegrationStore = create<IntegrationStore>((set, get) => ({
  selectTemplate: (template) => set({ template }),
  setTemplateDetails: (details: any[]) => set({ templateDetails: details })
}))

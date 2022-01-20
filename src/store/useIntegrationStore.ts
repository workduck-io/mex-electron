import create from 'zustand'
import { SyncBlockTemplate } from '../editor/components/SyncBlock'

export type IntegrationStore = {
  template?: SyncBlockTemplate
  selectTemplate: (template: SyncBlockTemplate) => void
  isTemplateDetailsLoading: boolean
  setIsTemplateDetailsLoading: (isLoading: boolean) => void
  templateDetails?: any[]
  setTemplateDetails: (details: any[]) => void
}

export const useIntegrationStore = create<IntegrationStore>((set, get) => ({
  selectTemplate: (template) => set({ template }),
  isTemplateDetailsLoading: false,
  setIsTemplateDetailsLoading: (isLoading: boolean) => set({ isTemplateDetailsLoading: isLoading }),
  setTemplateDetails: (details: any[]) => set({ templateDetails: details })
}))

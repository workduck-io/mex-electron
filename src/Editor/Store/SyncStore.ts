import { defaultMexIntent, intentsData, templates } from '../../Defaults/Test/intentsData'
import create from 'zustand'
import { SyncContextType } from '../Components/SyncBlock/SyncBlock.types'
import { sampleServices } from '../../Components/Integrations/sampleServices'

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncId: 'initial',
  syncBlocks: [],
  intents: intentsData,
  services: sampleServices,
  templates,

  addSyncBlock: (block) =>
    set((state) => ({
      syncBlocks: [...state.syncBlocks, block],
      syncId: String(Date.now())
    })),

  editSyncBlock: (block) => {
    let oldBlocks = get().syncBlocks
    oldBlocks = oldBlocks.filter((s) => s.id !== block.id)

    set({
      syncBlocks: [block, ...oldBlocks],
      syncId: String(Date.now())
    })
  },

  initSyncBlocks: (syncBlocks, templates) =>
    set(() => ({
      syncBlocks,
      // templates,
      syncId: String(Date.now())
    })),

  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, template]
    })),

  addIntentEmptyMap: (id) =>
    set((state) => ({
      intents: {
        ...state.intents,
        [id]: {
          intents: [defaultMexIntent],
          intentGroups: {}
        }
      }
    })),

  addIgid: (id, igid, intents, templateId) =>
    set((state) => ({
      intents: {
        ...state.intents,
        [id]: {
          ...state.intents[id],
          intentGroups: {
            ...state.intents[id].intentGroups,
            [igid]: {
              templateId,
              intents
            }
          }
        }
      }
    })),

  updateIntentsAndIGIDs: (id, nodeIntentConfig) =>
    set((state) => ({
      intents: {
        ...state.intents,
        [id]: nodeIntentConfig
      }
    }))
}))

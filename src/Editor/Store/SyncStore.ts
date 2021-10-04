import { sortBy } from 'lodash'
import create from 'zustand'
import { sampleServices } from '../../Components/Integrations/sampleServices'
import { defaultMexIntent, intentsData, templates } from '../../Defaults/Test/intentsData'
import { Service, SyncContextType } from '../Components/SyncBlock/SyncBlock.types'

const sortServices = (services: Service[]) => sortBy(services, (s) => s.id)

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncBlocks: [],
  intents: intentsData,
  services: sortServices(sampleServices),
  templates,

  addSyncBlock: (block) =>
    set((state) => ({
      syncBlocks: [...state.syncBlocks, block]
    })),

  editSyncBlock: (block) => {
    let oldBlocks = get().syncBlocks
    oldBlocks = oldBlocks.filter((s) => s.id !== block.id)

    set({
      syncBlocks: [block, ...oldBlocks]
    })
  },

  connectService: (id) =>
    set((state) => {
      const service = state.services.find((s) => s.id === id)
      const newServices = [
        ...state.services.filter((s) => s.id !== id),
        {
          ...service,
          connected: true
        }
      ]
      return {
        services: sortServices(newServices)
      }
    }),

  initSyncBlocks: (syncBlocks, templates, services, intents) =>
    set(() => ({
      syncBlocks,
      templates,
      services,
      intents
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
          intents: [defaultMexIntent(id)],
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

import { orderBy } from 'lodash'

import create from 'zustand'
import { defaultMexIntent, intentsData, templates } from '../data/Defaults/Test/intentsData'
import { Service, SyncContextType } from '../editor/Components/SyncBlock/SyncBlock.types'

const sortServices = (services: Service[]) => {
  const res = orderBy(services, ['enabled', 'connected', 'id'], ['desc', 'desc', 'asc'])
  return res
}

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncBlocks: [],
  intents: intentsData,
  services: sortServices([]),
  templates,

  addSyncBlock: (block) =>
    set((state) => ({
      syncBlocks: [...state.syncBlocks, block]
    })),

  setTemplates: (templates) => set({ templates }),

  editSyncBlock: (block) => {
    let oldBlocks = get().syncBlocks
    oldBlocks = oldBlocks.filter((s) => s.id !== block.id)

    set({
      syncBlocks: [block, ...oldBlocks]
    })
  },

  setSelected: (id) => set({ selectedSyncBlock: id }),

  connectService: (id) => {
    const services = get().services
    const newServices = services.map((service) => (service.id === id ? { ...service, connected: true } : service))
    set({
      services: sortServices(newServices)
    })
  },

  setServices: (services) => set({ services: sortServices(services) }),

  initSyncBlocks: (syncBlocks, templates, services, intents) =>
    set(() => ({
      syncBlocks,
      templates,
      services: sortServices(services),
      intents
    })),

  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, template]
    })),

  deleteTemplate: (templateId) =>
    set((state) => {
      return {
        templates: [...state.templates.filter((s) => s.id !== templateId)]
      }
    }),

  addIntentEmptyMap: (uid) =>
    set((state) => ({
      intents: {
        ...state.intents,
        [uid]: {
          intents: [defaultMexIntent(uid)],
          intentGroups: {}
        }
      }
    })),

  addIgid: (uid, igid, intents, templateId) =>
    set((state) => ({
      intents: {
        ...state.intents,
        [uid]: {
          ...state.intents[uid],
          intentGroups: {
            ...state.intents[uid].intentGroups,
            [igid]: {
              templateId,
              intents
            }
          }
        }
      }
    })),

  updateIntentsAndIGIDs: (uid, nodeIntentConfig) =>
    set((state) => ({
      intents: {
        ...state.intents,
        [uid]: nodeIntentConfig
      }
    }))
}))

import { sortBy } from 'lodash'
import create from 'zustand'
import { defaultMexIntent, intentsData, templates } from '../../Defaults/Test/intentsData'
import { Service, SyncContextType } from '../Components/SyncBlock/SyncBlock.types'

const sortServices = (services: Service[]) => sortBy(services, (s) => s.id)

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncBlocks: [],
  intents: intentsData,
  services: sortServices([]),
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

  setServices: (services) => set({ services }),

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

import { intentsData, templates } from '../../Defaults/Test/intentsData'
import create from 'zustand'
import { SyncContextType } from '../Components/SyncBlock/SyncBlock.types'

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncId: 'initial',
  syncBlocks: [],
  intents: intentsData,
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
      templates,
      syncId: String(Date.now())
    })),

  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, template]
    }))

  // addIntent: (id, intent) =>
  //   set((state) => {
  //     const prevIntents = state.intents[id] ?? []
  //     return { intents: { ...state.intents, [id]: [...prevIntents, intent] } }
  //   }),

  // setIntentsForNode: (id, intents) =>
  //   set((state) => ({
  //     intents: {
  //       ...state.intents,
  //       [id]: intents,
  //     },
  //   })),
}))

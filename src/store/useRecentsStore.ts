import { remove } from 'lodash'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { MAX_RECENT_SIZE } from '../data/Defaults/navigation'

export type RecentsType = {
  lastOpened: string[] // * NodeIds
  recentResearchNodes: string[] // * NodeIds
  setRecentResearchNodes: (nodes: Array<string>) => void
  addRecent: (nodeid: string) => void
  update: (lastOpened: string[]) => void
  clear: () => void
  clearResearchNodes: () => void
  addInResearchNodes: (nodeid: string) => void
  initRecents: (recentList: Array<string>) => void
}

export const useRecentsStore = create<RecentsType>(
  persist(
    devtools((set, get) => ({
      lastOpened: [],
      recentResearchNodes: [],
      setRecentResearchNodes: (nodes: Array<string>) => {
        set({ recentResearchNodes: nodes })
      },
      clearResearchNodes: () => {
        set({ recentResearchNodes: [] })
      },
      addInResearchNodes: (nodeid: string) => {
        const oldLast10 = Array.from(new Set(get().recentResearchNodes))
        if (oldLast10.includes(nodeid)) {
          remove(oldLast10, (item) => item === nodeid)
        }

        set({
          recentResearchNodes: [...oldLast10.slice(-MAX_RECENT_SIZE + 1), nodeid]
        })
      },
      clear: () => {
        set({ lastOpened: [], recentResearchNodes: [] })
      },
      addRecent: (nodeid: string) => {
        const oldLast10 = Array.from(new Set(get().lastOpened))
        if (oldLast10.includes(nodeid)) {
          remove(oldLast10, (item) => item === nodeid)
        }

        set({
          lastOpened: [...oldLast10.slice(-MAX_RECENT_SIZE + 1), nodeid]
        })
      },
      update: (lastOpened: string[]) =>
        set({
          lastOpened
        }),
      initRecents: (recentList) => set({ lastOpened: recentList })
    })),
    {
      name: 'recents'
    }
  )
)

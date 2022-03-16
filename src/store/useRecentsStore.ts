import { remove } from 'lodash'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_RECENT_SIZE } from '../data/Defaults/navigation'

export type RecentsType = {
  lastOpened: string[]
  recentResearchNodes: string[]
  setRecentResearchNodes: (nodes: Array<string>) => void
  addRecent: (nodeid: string) => void
  update: (lastOpened: string[]) => void
  clear: () => void
  clearResearchNodes: () => void
  addInResearchNodes: (nodeid: string) => void
  initRecents: (recentList: Array<string>) => void

  // Public Node Data. Does not really belong in recents store but did not want to create a store just for this
  publicNodes: Record<string, string>
  setNodePublic: (nodeId: string, publicURL: string) => void
  setNodePrivate: (nodeId: string) => void
  checkNodePublic: (nodeId) => string | undefined
}

export const useRecentsStore = create<RecentsType>(
  persist(
    (set, get) => ({
      publicNodes: {},
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
        set({ lastOpened: [] })
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
      initRecents: (recentList) => set({ lastOpened: recentList }),
      setNodePublic: (nodeId, publicURL) => {
        if (get().publicNodes[nodeId]) return
        set({ publicNodes: { ...get().publicNodes, [nodeId]: publicURL } })
      },
      setNodePrivate: (nodeId) => {
        if (get().publicNodes[nodeId]) {
          const newNodes = get().publicNodes
          delete newNodes[nodeId]
          set({ publicNodes: newNodes })
        }
      },
      checkNodePublic: (nodeId) => {
        return get().publicNodes?.[nodeId]
      }
    }),
    {
      name: 'mex-recents-store'
    }
  )
)

import { remove } from 'lodash'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_RECENT_SIZE } from '../data/Defaults/navigation'

export type RecentsType = {
  lastOpened: string[]
  addRecent: (uid: string) => void
  update: (lastOpened: string[]) => void
  clear: () => void
  initRecents: (recentList: Array<string>) => void
}

export const useRecentsStore = create<RecentsType>(
  persist(
    (set, get) => ({
      lastOpened: [],
      clear: () => {
        set({ lastOpened: [] })
      },
      addRecent: (uid: string) => {
        const oldLast10 = Array.from(new Set(get().lastOpened))
        if (oldLast10.includes(uid)) {
          remove(oldLast10, (item) => item === uid)
        }

        set({
          lastOpened: [...oldLast10.slice(-MAX_RECENT_SIZE + 1), uid]
        })
      },
      update: (lastOpened: string[]) =>
        set({
          lastOpened
        }),
      initRecents: (recentList) => set({ lastOpened: recentList })
    }),
    {
      name: 'recents'
    }
  )
)

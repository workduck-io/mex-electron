import create from 'zustand'
import { remove } from 'lodash'
import { MAX_RECENT_SIZE } from '../../Defaults/navigation'
import { persist } from 'zustand/middleware'

export type RecentsType = {
  lastOpened: string[]
  addRecent: (id: string) => void
  update: (lastOpened: string[]) => void
  clear: () => void
  initRecents: (recentList: Array<string>) => void
}

export const useRecentsStore = create<RecentsType>(
  persist(
    (set, get) => ({
      lastOpened: [],
      clear: () => set({ lastOpened: [] }),
      addRecent: (id: string) => {
        // We move the id to the top if the id is present
        // swapping can increase performance
        const oldLast10 = Array.from(new Set(get().lastOpened))
        if (oldLast10.includes(id)) {
          remove(oldLast10, (item) => item === id)
        }
        set({
          lastOpened: [...oldLast10.slice(-MAX_RECENT_SIZE + 1), id]
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

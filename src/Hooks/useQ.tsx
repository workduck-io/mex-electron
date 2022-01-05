import create from 'zustand'
import { useDataSaverFromContent } from '../Editor/Components/Saver'

interface QStoreProps {
  q: string[]
  setQ: (q: string[]) => void
  add2Q: (uid: string) => void
  clearQ: () => void
}

export const useQStore = create<QStoreProps>((set, get) => ({
  q: [],
  setQ: (q) => set({ q }),
  add2Q: (uid) => set({ q: Array.from(new Set([...get().q, uid])) }),
  clearQ: () => set({ q: [] })
}))

export const useSaveQ = () => {
  const q = useQStore((s) => s.q)
  const clearQ = useQStore((s) => s.clearQ)

  // const getContent = useContentStore((s) => s.getContent)
  const { saveNodeAPIandFs } = useDataSaverFromContent()

  const saveQ = () => {
    [...q].map((uid) => {
      saveNodeAPIandFs(uid)
    })
    // console.log('saving q', { q })
    clearQ()
  }

  return { q, saveQ }
}

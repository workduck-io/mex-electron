import { mog } from '../utils/lib/helper'
import create from 'zustand'
import { useDataSaverFromContent } from '../editor/Components/Saver'
import { useContentStore } from '../store/useContentStore'
import { NodeEditorContent } from '../types/Types'
import { useSaveData } from './useSaveData'

interface BufferStore {
  buffer: Record<string, NodeEditorContent>
  add: (uid: string, val: NodeEditorContent) => void
  remove: (uid: string) => void
  clear: () => void
}

const useBufferStore = create<BufferStore>((set, get) => ({
  buffer: {},
  add: (uid, val) => set({ buffer: { ...get().buffer, [uid]: val } }),
  remove: (uid) => {
    const newBuffer = get().buffer
    if (newBuffer[uid]) delete newBuffer[uid]
    set({ buffer: newBuffer })
  },
  clear: () => set({ buffer: {} })
}))

export const useEditorBuffer = () => {
  const add2Buffer = useBufferStore((s) => s.add)
  const clearBuffer = useBufferStore((s) => s.clear)
  const setContent = useContentStore((s) => s.setContent)
  const { saveData } = useSaveData()

  const { saveNodeAPIandFs } = useDataSaverFromContent()

  const addOrUpdateValBuffer = (uid: string, val: NodeEditorContent) => {
    add2Buffer(uid, val)
  }

  const getBuffer = () => useBufferStore.getState().buffer
  const getBufferVal = (uid: string) => useBufferStore.getState().buffer[uid] ?? undefined
  const saveAndClearBuffer = () => {
    const buffer = useBufferStore.getState().buffer
    mog('Save And Clear Buffer', { buffer })
    if (Object.keys(buffer).length > 0) {
      Object.entries(buffer).map(([uid, val]) => {
        setContent(uid, val)
        saveNodeAPIandFs(uid)
      })
      saveData()
      clearBuffer()
    }
  }

  return { addOrUpdateValBuffer, saveAndClearBuffer, getBuffer, getBufferVal, clearBuffer }
}

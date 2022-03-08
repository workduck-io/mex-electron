import create from 'zustand'
import { useDataSaverFromContent } from '../editor/Components/Saver'
import { NodeEditorContent } from '../types/Types'
import { mog } from '../utils/lib/helper'
import { useSaveData } from './useSaveData'

interface BufferStore {
  buffer: Record<string, NodeEditorContent>
  add: (nodeid: string, val: NodeEditorContent) => void
  remove: (nodeid: string) => void
  clear: () => void
}

export const useBufferStore = create<BufferStore>((set, get) => ({
  buffer: {},
  add: (nodeid, val) => set({ buffer: { ...get().buffer, [nodeid]: val } }),
  remove: (nodeid) => {
    const newBuffer = get().buffer
    if (newBuffer[nodeid]) delete newBuffer[nodeid]
    set({ buffer: newBuffer })
  },
  clear: () => set({ buffer: {} })
}))

export const useEditorBuffer = () => {
  const add2Buffer = useBufferStore((s) => s.add)
  const clearBuffer = useBufferStore((s) => s.clear)
  const { saveData } = useSaveData()

  const { saveNodeWithValue } = useDataSaverFromContent()

  const addOrUpdateValBuffer = (nodeid: string, val: NodeEditorContent) => {
    add2Buffer(nodeid, val)
  }

  const getBuffer = () => useBufferStore.getState().buffer
  const getBufferVal = (nodeid: string) => useBufferStore.getState().buffer[nodeid] ?? undefined
  const saveAndClearBuffer = () => {
    const buffer = useBufferStore.getState().buffer
    mog('Save And Clear Buffer', { buffer })
    if (Object.keys(buffer).length > 0) {
      Object.entries(buffer).map(([nodeid, val]) => {
        saveNodeWithValue(nodeid, val)
      })
      saveData()
      clearBuffer()
    }
  }

  return { addOrUpdateValBuffer, saveAndClearBuffer, getBuffer, getBufferVal, clearBuffer }
}

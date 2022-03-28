import create from 'zustand'
import { useDataSaverFromContent } from '../editor/Components/Saver'
import { useSnippetStore } from '../store/useSnippetStore'
import { NodeEditorContent } from '../types/Types'
import { getContent } from '../utils/helpers'
import { areEqual } from '../utils/lib/hash'
import { mog } from '../utils/lib/helper'
import { measureTime } from '../utils/lib/perf'
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
    // mog('Buff up', { nodeid, val })
    add2Buffer(nodeid, val)
  }

  const getBuffer = () => useBufferStore.getState().buffer
  const getBufferVal = (nodeid: string) => useBufferStore.getState().buffer[nodeid] ?? undefined

  const saveAndClearBuffer = () => {
    const buffer = useBufferStore.getState().buffer
    // mog('Save And Clear Buffer', { buffer })
    if (Object.keys(buffer).length > 0) {
      const saved = Object.entries(buffer)
        .map(([nodeid, val]) => {
          const content = getContent(nodeid)
          const res = areEqual(content.content, val)
          // const mT = measureTime(() => areEqual(content.content, val))
          if (!res) {
            saveNodeWithValue(nodeid, val)
          }
          return !res
        })
        .reduce((acc, cur) => acc || cur, false)
      if (saved) {
        saveData()
      }
      clearBuffer()
    }
  }

  return { addOrUpdateValBuffer, saveAndClearBuffer, getBuffer, getBufferVal, clearBuffer }
}

export const useSnippetBufferStore = create<BufferStore>((set, get) => ({
  buffer: {},
  add: (nodeid, val) => set({ buffer: { ...get().buffer, [nodeid]: val } }),
  remove: (nodeid) => {
    const newBuffer = get().buffer
    if (newBuffer[nodeid]) delete newBuffer[nodeid]
    set({ buffer: newBuffer })
  },
  clear: () => set({ buffer: {} })
}))

export const useSnippetBuffer = () => {
  const add2Buffer = useSnippetBufferStore((s) => s.add)
  const clearBuffer = useSnippetBufferStore((s) => s.clear)
  const updateSnippetContent = useSnippetStore((s) => s.updateSnippetContent)
  const { saveData } = useSaveData()

  const addOrUpdateValBuffer = (snippetId: string, val: NodeEditorContent) => {
    add2Buffer(snippetId, val)
  }

  const getBuffer = () => useSnippetBufferStore.getState().buffer
  const getBufferVal = (nodeid: string) => useSnippetBufferStore.getState().buffer[nodeid] ?? undefined

  const saveAndClearBuffer = () => {
    const buffer = useSnippetBufferStore.getState().buffer
    mog('Save And Clear Snippet Buffer', { buffer })
    if (Object.keys(buffer).length > 0) {
      const saved = Object.entries(buffer)
        .map(([snippetId, val]) => {
          updateSnippetContent(snippetId, val)
          return true
        })
        .reduce((acc, cur) => acc || cur, false)
      if (saved) {
        saveData()
      }
      clearBuffer()
    }
  }

  return { addOrUpdateValBuffer, saveAndClearBuffer, getBuffer, getBufferVal, clearBuffer }
}

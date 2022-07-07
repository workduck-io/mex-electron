import { useApi } from '@apis/useSaveApi'
import create from 'zustand'
import { useDataSaverFromContent } from '../editor/Components/Saver'
import { useSnippetStore } from '../store/useSnippetStore'
import { NodeEditorContent } from '../types/Types'
import { getContent } from '../utils/helpers'
import { areEqual } from '../utils/lib/hash'
import { mog } from '../utils/lib/helper'
import { measureTime } from '../utils/lib/perf'
import { useNodes } from './useNodes'
import { useSaveData } from './useSaveData'
import { useSnippets } from './useSnippets'

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
  const { isSharedNode } = useNodes()

  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()

  const addOrUpdateValBuffer = (nodeid: string, val: NodeEditorContent) => {
    add2Buffer(nodeid, val)
  }

  const getBuffer = () => useBufferStore.getState().buffer
  const getBufferVal = (nodeid: string) => useBufferStore.getState().buffer[nodeid] ?? undefined

  const saveAndClearBuffer = (explicitSave?: boolean) => {
    const buffer = useBufferStore.getState().buffer
    mog('Save And Clear Buffer', { buffer })
    if (Object.keys(buffer).length > 0) {
      const saved = Object.entries(buffer)
        .map(([nodeid, val]) => {
          const content = getContent(nodeid)
          const res = areEqual(content.content, val)
          const isShared = isSharedNode(nodeid)
          // const mT = measureTime(() => areEqual(content.content, val))
          if (!res) {
            saveEditorValueAndUpdateStores(nodeid, val, { saveApi: true, isShared })
          }
          return !res
        })
        .reduce((acc, cur) => acc || cur, false)
      if (explicitSave !== false && (saved || explicitSave)) {
        saveData()
      }
      clearBuffer()
    }
  }

  return { addOrUpdateValBuffer, saveAndClearBuffer, getBuffer, getBufferVal, clearBuffer }
}

interface SnippetBufferStore {
  buffer: Record<string, { content: NodeEditorContent; title: string; isTemplate?: boolean }>
  add: (nodeid: string, val: NodeEditorContent) => void
  addTitle: (nodeid: string, title: string) => void
  toggleIsTemplate: (nodeid: string, isTemplate: boolean) => void
  addAll: (nodeid: string, val: NodeEditorContent, title: string) => void
  remove: (nodeid: string) => void
  clear: () => void
}

export const useSnippetBufferStore = create<SnippetBufferStore>((set, get) => ({
  buffer: {},
  add: (nodeid, val) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, content: val } } })
  },
  addTitle: (nodeid, title) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, title } } })
  },
  toggleIsTemplate: (nodeid: string, isTemplate: boolean) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, isTemplate } } })
  },
  addAll: (nodeid, val, title) => {
    const prev = get().buffer[nodeid]
    set({ buffer: { ...get().buffer, [nodeid]: { ...prev, content: val, title } } })
  },
  remove: (nodeid) => {
    const newBuffer = get().buffer
    if (newBuffer[nodeid]) delete newBuffer[nodeid]
    set({ buffer: newBuffer })
  },
  clear: () => set({ buffer: {} })
}))

export const useSnippetBuffer = () => {
  const api = useApi()
  const add2Buffer = useSnippetBufferStore((s) => s.add)
  const clearBuffer = useSnippetBufferStore((s) => s.clear)
  const updateSnippetContent = useSnippetStore((s) => s.updateSnippetContentAndTitle)
  const { saveData } = useSaveData()
  const { updateSnippet: updateSnippetIndex, getSnippet } = useSnippets()

  const addOrUpdateValBuffer = (snippetId: string, val: NodeEditorContent) => {
    mog('Add to buffer', { snippetId, val })
    add2Buffer(snippetId, val)
  }

  const getBuffer = () => useSnippetBufferStore.getState().buffer
  const getBufferVal = (nodeid: string) => useSnippetBufferStore.getState().buffer[nodeid] ?? undefined

  const saveAndClearBuffer = () => {
    const buffer = useSnippetBufferStore.getState().buffer
    mog('Save And Clear Snippet Buffer', { buffer })
    if (Object.keys(buffer).length > 0) {
      {
        /*
          const saved = Object.entries(buffer)
        .map(([snippetId, val]) => {
          api.saveSnippetAPI(snippetId, val.title, val?.content)
          updateSnippetContent(snippetId, val.content, val.title, val.isTemplate)
          const snippet = getSnippet(snippetId)

          // TODO: Switch snippet to template index
          if (snippet) updateSnippetIndex({ ...snippet, content: val.content, title: val.title })
          return true
        })
        .reduce((acc, cur) => acc || cur, false)

*/
      }
      const saved = Object.entries(buffer)
        .map(([snippetId, val]) => {
          const snippet = getSnippet(snippetId)
          api.saveSnippetAPI(snippetId, val.title ?? snippet.title, val?.content ?? snippet?.content)
          // updateSnippetContent(snippetId, val.content ?? snippet.content, val.title ?? snippet.title, val.isTemplate)
          mog('snipppet', { snippetId, val, buffer })
          // TODO: Switch snippet to template index
          if (snippet)
            updateSnippetIndex({
              ...snippet,
              content: val.content ?? snippet.content,
              isTemplate: val.isTemplate ?? snippet.isTemplate,
              title: val.title ?? snippet.title
            })
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

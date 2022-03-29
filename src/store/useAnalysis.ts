import { useEffect, useMemo, useRef } from 'react'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'

import create from 'zustand'
import { useBufferStore, useEditorBuffer } from '../hooks/useEditorBuffer'
import { useEditorStore } from './useEditorStore'
import { getContent } from '../utils/helpers'
import { mog } from '../utils/lib/helper'
import { TodoType } from '../editor/Components/Todo/types'
import useTodoStore from './useTodoStore'
import { getTodosFromContent } from '../utils/lib/content'
import { areEqual } from '../utils/lib/hash'

export interface OutlineItem {
  id: string
  title: string
  type: string
  level?: number
}

export interface NodeAnalysis {
  nodeid: string
  tags: string[]
  outline: OutlineItem[]
  editorTodos: TodoType[]
}

interface AnalysisStore {
  analysis: NodeAnalysis
  setAnalysis: (analysis: NodeAnalysis) => void
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  analysis: {
    nodeid: undefined,
    tags: [],
    outline: [],
    editorTodos: []
  },
  setAnalysis: (analysis: NodeAnalysis) => {
    set({ analysis })
  }
}))

export const useAnalysisTodoAutoUpdate = () => {
  // const { setTodo } = useEditorStore(state => state)
  const analysis = useAnalysisStore((state) => state.analysis)
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)
  const node = useEditorStore((state) => state.node)

  useEffect(() => {
    const { editorTodos, nodeid } = useAnalysisStore.getState().analysis
    updateNodeTodos(nodeid, editorTodos)
  }, [analysis, node])
}

export const useAnalysisIPC = () => {
  const setAnalysis = useAnalysisStore((s) => s.setAnalysis)
  const node = useEditorStore((s) => s.node)

  const setIpc = () => {
    mog('Setting up IPC for analysis', { node })
    ipcRenderer.on(IpcAction.RECEIVE_ANALYSIS, (_event, analysis: any) => {
      // mog('analysisRECEIVEd', { analysis })
      if (analysis) setAnalysis(analysis)
    })
  }

  return setIpc
}

export const useAnalysis = () => {
  const node = useEditorStore((s) => s.node)
  const { getBufferVal } = useEditorBuffer()
  const buffer = useBufferStore((s) => s.buffer)

  // mog('Setting up IPC for Buffer', { node })
  useEffect(() => {
    const bufferContent = getBufferVal(node.nodeid)
    const content = getContent(node.nodeid)
    // mog('sending for calc', { node, buffer })
    if (bufferContent) {
      // mog('Buffer for calc', { bufferContent })
      if (!areEqual(bufferContent, content.content)) {
        ipcRenderer.send(IpcAction.ANALYSE_CONTENT, { content: bufferContent, nodeid: node.nodeid })
      }
    } else {
      // mog('Content for calc', { content })
      if (content && content.content)
        ipcRenderer.send(IpcAction.ANALYSE_CONTENT, { content: content.content, nodeid: node.nodeid })
    }
  }, [node.nodeid, buffer])

  return {}
}

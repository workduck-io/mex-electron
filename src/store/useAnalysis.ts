import { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'

import create from 'zustand'
import { useBufferStore, useEditorBuffer } from '../hooks/useEditorBuffer'
import { useEditorStore } from './useEditorStore'
import { getContent } from '../utils/helpers'
import { TodoType } from '../editor/Components/Todo/types'
import useTodoStore from './useTodoStore'
import { areEqual } from '../utils/lib/hash'
import { checkIfUntitledDraftNode } from '../utils/lib/strings'
import { useSearchExtra } from '@hooks/useSearch'
import { AnalysisOptions } from '@electron/worker/controller'
import { useLinks } from '@hooks/useLinks'
import { getParentNodePath } from '@components/mex/Sidebar/treeUtils'

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
  title?: string
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
    ipcRenderer.on(IpcAction.RECEIVE_ANALYSIS, (_event, analysis: any) => {
      // mog('analysisRECEIVEd', { analysis })
      if (analysis) setAnalysis(analysis)
    })
  }

  return setIpc
}

export const useAnalysis = () => {
  const node = useEditorStore((s) => s.node)
  const { getNodeidFromPath } = useLinks()
  const { getBufferVal } = useEditorBuffer()
  const buffer = useBufferStore((s) => s.buffer)
  const { getSearchExtra } = useSearchExtra()

  // mog('Setting up IPC for Buffer', { node })
  useEffect(() => {
    const parentNodePath = getParentNodePath(node.path)
    const parentNodeId = getNodeidFromPath(parentNodePath, node.namespace)
    const parentMetadata = getContent(parentNodeId)?.metadata

    const bufferContent = getBufferVal(node.nodeid)
    const content = getContent(node.nodeid)
    const metadata = content.metadata
    const modifier = getSearchExtra()
    const options: AnalysisOptions = { modifier }

    const isUntitledDraftNode = checkIfUntitledDraftNode(node.path)
    const isNewDraftNode = metadata?.createdAt === metadata?.updatedAt

    // * New Draft node, get Title from its content
    if (isUntitledDraftNode && isNewDraftNode && !parentMetadata?.templateID) {
      options['title'] = true
    }

    // mog('sending for calc', { node, buffer })
    // mog('Buffer for calc', { bufferContent })
    if (bufferContent) {
      if (!areEqual(bufferContent, content.content)) {
        ipcRenderer.send(IpcAction.ANALYSE_CONTENT, { content: bufferContent, nodeid: node.nodeid, options })
      }
    } else {
      // mog('Content for calc', { content })
      if (content && content.content)
        ipcRenderer.send(IpcAction.ANALYSE_CONTENT, { content: content.content, nodeid: node.nodeid, options })
    }
  }, [node.nodeid, buffer])

  return {}
}

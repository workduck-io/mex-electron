import { useEffect } from 'react'

import { getParentNodePath } from '@components/mex/Sidebar/treeUtils'
import { AnalysisOptions } from '@electron/worker/controller'
import { useLinks } from '@hooks/useLinks'
import { useSearchExtra } from '@hooks/useSearch'
import { useTodoBuffer } from '@hooks/useTodoBuffer'
import { NodeEditorContent } from '@types/Types'
import { ipcRenderer } from 'electron'
import create from 'zustand'

import { mog } from '@workduck-io/mex-utils'

import { IpcAction } from '../data/IpcAction'
import { TodoType } from '../editor/Components/Todo/types'
import { useBufferStore, useEditorBuffer } from '../hooks/useEditorBuffer'
import { getContent } from '../utils/helpers'
import { areEqual } from '../utils/lib/hash'
import { checkIfUntitledDraftNode } from '../utils/lib/strings'
import { useContentStore } from './useContentStore'
import { useEditorStore } from './useEditorStore'

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

export const useAnalysisIPC = () => {
  const setAnalysis = useAnalysisStore((s) => s.setAnalysis)

  const setIpc = () => {
    ipcRenderer.on(IpcAction.RECEIVE_ANALYSIS, (_event, analysis: any) => {
      if (analysis) setAnalysis(analysis)
    })
  }

  return setIpc
}

export const sendForAnalysis = (noteId: string, content: NodeEditorContent, options?: { title?: boolean }) => {
  ipcRenderer.send(IpcAction.ANALYSE_CONTENT, { content, nodeid: noteId, options })
}

export const analyzeNote = (noteId: string, options?: { title?: boolean }) => {
  const noteBuffer = useBufferStore.getState().buffer?.[noteId]
  const noteContent = useContentStore.getState().getContent(noteId)?.content

  if (noteBuffer) {
    if (!areEqual(noteBuffer, noteContent)) sendForAnalysis(noteId, noteBuffer, options)
  }
}

export const useAnalysis = () => {
  const node = useEditorStore((s) => s.node)
  const { getNodeidFromPath } = useLinks()
  const { getBufferVal } = useEditorBuffer()
  const buffer = useBufferStore((s) => s.buffer)
  const { getSearchExtra } = useSearchExtra()

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

    if (bufferContent) {
      if (!areEqual(bufferContent, content.content)) {
        sendForAnalysis(node.nodeid, bufferContent, options)
      }
    } else {
      if (content && content.content) sendForAnalysis(node.nodeid, content.content, options)
    }
  }, [node.nodeid, buffer])

  return {}
}

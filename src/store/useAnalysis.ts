import { useEffect, useMemo, useRef } from 'react'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'

import create from 'zustand'
import { useBufferStore, useEditorBuffer } from '../hooks/useEditorBuffer'
import { useEditorStore } from './useEditorStore'
import { getContent } from '../utils/helpers'
import { mog } from '../utils/lib/helper'

export interface OutlineItem {
  id: string
  title: string
  type: string
  level: number
}

export interface NodeAnalysis {
  tags: string[]
  outline: OutlineItem[]
}

interface AnalysisStore extends NodeAnalysis {
  setAnalysis: (analysis: NodeAnalysis) => void
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  tags: [],
  outline: [],
  setAnalysis: (analysis: NodeAnalysis) => {
    set(analysis)
  }
}))

export const useAnalysisIPC = () => {
  const setAnalysis = useAnalysisStore((s) => s.setAnalysis)
  const node = useEditorStore((s) => s.node)

  const setIpc = () => {
    mog('Setting up IPC for analysis', { node })
    ipcRenderer.on(IpcAction.RECIEVE_ANALYIS, (_event, analysis: any) => {
      // mog('analysisRecieved', { analysis })
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
    mog('sending for calc', { node, buffer })
    if (bufferContent) {
      // mog('Buffer for calc', { bufferContent })
      ipcRenderer.send(IpcAction.ANALYSE_CONTENT, bufferContent)
    } else {
      const content = getContent(node.nodeid)
      // mog('Content for calc', { content })
      if (content && content.content) ipcRenderer.send(IpcAction.ANALYSE_CONTENT, content.content)
    }
  }, [node.nodeid, buffer])

  return {}
}

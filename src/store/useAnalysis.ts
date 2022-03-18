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
  systemTags?: string[]
  urls?: string[]
  ilinks?: string[]
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

export const useAnalysis = () => {
  const node = useEditorStore((s) => s.node)
  const { getBufferVal } = useEditorBuffer()
  const buffer = useBufferStore((s) => s.buffer)
  const setAnalysis = useAnalysisStore((s) => s.setAnalysis)

  // mog('Setting up IPC for Buffer', { node })
  useEffect(() => {
    async function getAnalysis() {
      const bufferContent = getBufferVal(node.nodeid)
      mog('sending for calc', { node, buffer })
      let analysisContent: any
      if (bufferContent) {
        analysisContent = bufferContent
        ipcRenderer.send(IpcAction.ANALYSE_CONTENT, bufferContent)
      } else {
        const content = getContent(node.nodeid)
        if (content && content.content) analysisContent = content.content
      }
      const analysis = await ipcRenderer.invoke(IpcAction.ANALYSE_CONTENT, analysisContent)
      
      setAnalysis(analysis)
    }
    getAnalysis()
  }, [node.nodeid, buffer])

  return {}
}

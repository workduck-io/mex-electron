import { useEffect } from 'react'

import { AppType } from '@data/constants'
import { usePlateEditorRef } from '@udecode/plate'
import create from 'zustand'

import useDataStore from '../store/useDataStore'
import { useEditorStore } from '../store/useEditorStore'
import { NodeEditorContent } from '../types/Types'
import { NavigationType, ROUTE_PATHS, useRouting } from '../views/routes/urls'
import { useEditorBuffer } from './useEditorBuffer'
import { useLinks } from './useLinks'
import useLoad from './useLoad'
import { useNamespaces } from './useNamespaces'

// import { NodeEditorContent } from '../editor/Store/Types'
// import { useEditorStore } from '../editor/Store/EditorStore'
// import useLoad from './useLoad/useLoad'
interface ErrorState {
  prevNode: string
  alreadyErrored: boolean
  setPrevNode: (prevNode: string) => void
  setAlreadyErrored: (alreadyErrored: boolean) => void
  setErrorState: (curNode: string, alreadyErrored: boolean) => void
}

export const useEditorErrorStore = create<ErrorState>((set, get) => ({
  prevNode: '',
  alreadyErrored: false,
  setPrevNode: (prevNode: string) => set({ prevNode }),
  setAlreadyErrored: (alreadyErrored: boolean) => set({ alreadyErrored }),
  setErrorState: (prevNode: string, alreadyErrored: boolean) => set({ prevNode, alreadyErrored })
}))

const useEditorActions = () => {
  const { loadNode } = useLoad()
  const node = useEditorStore((s) => s.node)
  const { clearBuffer } = useEditorBuffer()
  const { goTo } = useRouting()
  const baseNodePath = useDataStore((s) => s.baseNodeId)
  const prevNode = useEditorErrorStore((s) => s.prevNode)
  const alreadyErrored = useEditorErrorStore((s) => s.alreadyErrored)
  const setAlreadyErrored = useEditorErrorStore((s) => s.setAlreadyErrored)
  const setErrorState = useEditorErrorStore((s) => s.setErrorState)
  const { getNodeidFromPath } = useLinks()
  const { getDefaultNamespace } = useNamespaces()

  const resetEditor = (appType: AppType = AppType.MEX) => {
    let nodeIdToLoad = node.nodeid
    const defaultNamespace = getDefaultNamespace()
    const basenode_nodeId = getNodeidFromPath(baseNodePath, defaultNamespace.id)
    // mog('resetEditor', { nodeIdToLoad, node, prevNode })
    const loadNodeL = (nodeIdToLoad: string) => {
      clearBuffer()
      // mog('resetEditor2', { nodeIdToLoad, node, prevNode })
      loadNode(nodeIdToLoad, { fetch: false, savePrev: false })
    }
    if (alreadyErrored) {
      if (prevNode === basenode_nodeId) {
        // What if the baseNode is bad?
        loadNodeL(basenode_nodeId)
        setErrorState(node.nodeid, true)
      } else if (prevNode === node.nodeid) {
        nodeIdToLoad = basenode_nodeId
        loadNodeL(basenode_nodeId)
        setErrorState(node.nodeid, false)
      }
    } else {
      nodeIdToLoad = node.nodeid
      loadNodeL(nodeIdToLoad)
      setErrorState(node.nodeid, true)
    }
    if (appType !== AppType.SPOTLIGHT) goTo(ROUTE_PATHS.node, NavigationType.push, nodeIdToLoad)
  }

  return {
    resetEditor
  }
}

export const useEditorChange = (editorId: string, content: NodeEditorContent, onChange?: any) => {
  const editor = usePlateEditorRef(editorId)
  useEffect(() => {
    if (editor && content) {
      editor.children = content
      if (onChange) onChange(content)
    }
  }, [editorId, content])
}

export default useEditorActions

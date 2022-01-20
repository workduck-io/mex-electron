import { usePlateEditorRef } from '@udecode/plate'
import { useEffect } from 'react'
import { NodeEditorContent } from '../editor/Store/Types'
import { useEditorStore } from '../editor/Store/EditorStore'
import useLoad from './useLoad/useLoad'

const useEditorActions = () => {
  const { loadNode } = useLoad()
  const node = useEditorStore((s) => s.node)

  const resetEditor = () => {
    loadNode(node.uid, { fetch: false, savePrev: false })
  }

  return {
    resetEditor
  }
}

export const useEditorChange = (editorId: string, content: NodeEditorContent) => {
  const editor = usePlateEditorRef(editorId)
  useEffect(() => {
    if (editor && content) {
      editor.children = content
    }
  }, [editorId, content])
}

export default useEditorActions

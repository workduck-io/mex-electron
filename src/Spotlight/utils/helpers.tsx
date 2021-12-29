import { usePlateEditorRef, deserializeHtml } from '@udecode/plate-core'
import { NodeEditorContent } from '../../Editor/Store/Types'

export const useDeserializeSelectionToNodes = (
  nodeId: string,
  selection: { text: string; metadata: string }
): NodeEditorContent => {
  const editor = usePlateEditorRef(nodeId)
  const nodes = editor
    ? deserializeHtml(editor, {
        element: selection?.text || ''
      })
    : undefined

  return nodes
}

export const getMexHTMLDeserializer = (HTMLContent: string, editor: any, plugins: any) => {
  const nodes = editor
    ? deserializeHtml(editor, {
        element: HTMLContent || ''
      })
    : undefined

  return nodes
}

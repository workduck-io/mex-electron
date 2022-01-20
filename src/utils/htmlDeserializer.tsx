import { htmlStringToDOMNode, usePlateEditorRef, deserializeHtml, htmlBodyToFragment } from '@udecode/plate-core'
import { NodeEditorContent } from '../types/Types'

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
  const element = htmlStringToDOMNode(HTMLContent ?? '')
  const nodes = editor ? htmlBodyToFragment(editor, element) : undefined

  return nodes
}

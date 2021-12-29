import { usePlateEditorRef, deserializeHtml } from '@udecode/plate-core'
import generatePlugins from '../../Editor/Plugins/plugins'
import { NodeEditorContent } from '../../Editor/Store/Types'

export const useDeserializeSelectionToNodes = (
  nodeId: string,
  selection: { text: string; metadata: string }
): NodeEditorContent => {
  const editor = usePlateEditorRef(nodeId)
  const plugins = generatePlugins()

  const nodes = editor
    ? deserializeHtml(editor, {
        plugins,
        element: selection?.text || ''
      })
    : undefined

  return nodes
}

export const getMexHTMLDeserializer = (HTMLContent: string, editor: any, plugins: any) => {
  const nodes = editor
    ? deserializeHTMLToDocumentFragment(editor, {
        plugins,
        element: HTMLContent || ''
      })
    : undefined

  return nodes
}

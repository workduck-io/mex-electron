import { usePlateEditorRef } from '@udecode/plate-core'
import { deserializeHTMLToDocumentFragment } from '@udecode/plate-html-serializer'
import generatePlugins from '../../Editor/Plugins/plugins'
import { NodeEditorContent } from '../../Editor/Store/Types'

export const useDeserializeSelectionToNodes = (
  nodeId: string,
  selection: { text: string; metadata: string }
): NodeEditorContent => {
  const editor = usePlateEditorRef(nodeId)
  const plugins = generatePlugins()

  const nodes = editor
    ? deserializeHTMLToDocumentFragment(editor, {
        plugins,
        element: selection?.text || ''
      })
    : undefined

  return nodes
}

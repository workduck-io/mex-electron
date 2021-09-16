import { useStoreEditorRef } from '@udecode/plate-core'
import { deserializeHTMLToDocumentFragment } from '@udecode/plate-html-serializer'
import { NodeEditorContent } from '../../Editor/Store/Types'
import generatePlugins from '../../Editor/Plugins/plugins'

export const useDeserializeSelectionToNodes = (
  nodeId: string,
  selection: { text: string; metadata: string }
): NodeEditorContent => {
  const editor = useStoreEditorRef(nodeId)
  const plugins = generatePlugins()

  const nodes = editor
    ? deserializeHTMLToDocumentFragment(editor, {
      plugins,
      element: selection?.text || ''
    })
    : undefined

  return nodes
}

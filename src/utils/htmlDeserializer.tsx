import { deserializeHtml, htmlBodyToFragment, htmlStringToDOMNode, usePlateEditorRef } from '@udecode/plate-core'

import { NodeEditorContent } from '../types/Types'
import components from '../editor/Components/components'
import { createPlateUIEditor } from '@udecode/plate'
import getPlugins from '../editor/Plugins/plugins'
import { updateIds } from './dataTransform'

export const plateEditor = () => {
  const plugins = getPlugins(components, { exclude: { dnd: true } })
  return createPlateUIEditor({ plugins })
}

export const useDeserializeSelectionToNodes = (
  path: string,
  selection: { text: string; metadata: string }
): NodeEditorContent => {
  let nodes
  const editor = usePlateEditorRef() ?? plateEditor()
  const element = htmlStringToDOMNode(selection?.text ?? '<p></p>')

  try {
    nodes = editor ? deserializeHtml(editor, { element, stripWhitespace: true }) : undefined
    if (nodes) nodes = nodes.map((block) => updateIds(block, true))
  } catch (err) {
    console.log(err)
  }

  return nodes
}

export const getMexHTMLDeserializer = (HTMLContent: string, editor: any, plugins: any) => {
  const element = htmlStringToDOMNode(HTMLContent ?? '')

  const nodes = editor ? htmlBodyToFragment(editor, element) : undefined

  return nodes
}

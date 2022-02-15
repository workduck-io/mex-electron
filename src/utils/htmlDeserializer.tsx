import { deserializeHtml, htmlBodyToFragment, htmlStringToDOMNode, usePlateEditorRef } from '@udecode/plate-core'
import { NodeEditorContent } from '../types/Types'
import { mog } from './lib/helper'

export const useDeserializeSelectionToNodes = (
  path: string,
  selection: { text: string; metadata: string }
): NodeEditorContent => {
  let nodes
  const editor = usePlateEditorRef(path)
  const element = htmlStringToDOMNode(selection?.text ?? '<p></p>')

  try {
    nodes = editor ? deserializeHtml(editor, { element }) : undefined
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

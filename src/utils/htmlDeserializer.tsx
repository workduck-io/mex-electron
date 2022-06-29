import {
  deserializeHtml,
  ELEMENT_DEFAULT,
  getPlateEditorRef,
  htmlBodyToFragment,
  htmlStringToDOMNode
} from '@udecode/plate-core'

import { BlockType } from '../store/useBlockStore'
import { NodeEditorContent } from '../types/Types'
import components from '../editor/Components/components'
import { createPlateUIEditor } from '@udecode/plate'
import getPlugins from '../editor/Plugins/plugins'
import { updateIds } from './dataTransform'
import { Descendant, Editor, Text } from 'slate'
import { generateTempId } from '../data/Defaults/idPrefixes'

export const plateEditor = () => {
  const plugins = getPlugins(components, { exclude: { dnd: true } })
  return createPlateUIEditor({ plugins })
}

const isInlineNode = (editor: Pick<Editor, 'isInline'>) => (node: Descendant) =>
  Text.isText(node) || editor.isInline(node)

export const getDeserializeSelectionToNodes = (
  selection: { text: string; metadata: string },
  highlight?: boolean
): NodeEditorContent => {
  let nodes
  const editor = getPlateEditorRef() ?? plateEditor()
  const element = htmlStringToDOMNode(selection?.text ?? '<p></p>')

  try {
    nodes = editor ? deserializeHtml(editor, { element, stripWhitespace: true }) : undefined

    if (nodes) {
      let isText = true
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        if (!isInlineNode(editor)(node)) {
          isText = false
          break
        }
      }

      if (isText) nodes = [{ id: generateTempId(), type: ELEMENT_DEFAULT, children: nodes }]
    }
    if (nodes) nodes = nodes.map((block) => updateIds(block, true))
    if (nodes) nodes = nodes.map((node) => highlightNodes(node, highlight))
  } catch (err) {
    console.log(err)
  }

  return nodes
}

export const highlightNodes = (blockToHighlight: BlockType, highlight?: boolean) => {
  // * if show is true add highlight else remove highlight from nested obj
  const block = Object.assign({}, blockToHighlight)

  if (highlight) {
    block['highlight'] = true
  } else delete block['highlight']

  if (block.children) {
    block.children = block.children.map((bl) => {
      return highlightNodes(bl, highlight)
    })
  }

  return block
}

export const getMexHTMLDeserializer = (HTMLContent: string, editor: any) => {
  const element = htmlStringToDOMNode(HTMLContent ?? '')
  let nodes = editor ? deserializeHtml(editor, { element, stripWhitespace: true }) : undefined

  if (nodes) {
    let isText = true
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]

      if (!isInlineNode(editor)(node)) {
        isText = false
        break
      }
    }

    if (isText) nodes = [{ id: generateTempId(), type: ELEMENT_DEFAULT, children: nodes }]
  }
  return nodes
}

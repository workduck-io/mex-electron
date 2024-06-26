import { PlatePlugin, WithOverride, deleteFragment } from '@udecode/plate-core'

import { ELEMENT_TAG } from './defaults'
import { getTagDeserialize } from './getTagDeserialize'
import { getPreviousNode, insertText } from '@udecode/plate'

/**
 * Enables support for hypertags.
 */
export const createTagPlugin = (): PlatePlugin => ({
  key: ELEMENT_TAG,
  isElement: true,
  deserializeHtml: getTagDeserialize(),
  isInline: true,
  isVoid: true,
  withOverrides: withTag
})

/**
 *
 * On DeleteBackward:
 * Check if the node above is a Tag and if so, delete it and insert the tag value to be edited by the user
 *
 */
export const withTag: WithOverride = (editor, { type, options }) => {
  // mog('Setup Plugin with Tag', { type, options })
  const { deleteBackward } = editor

  editor.deleteBackward = (options) => {
    const prev = getPreviousNode(editor)
    if (prev && prev[0]) {
      const node = prev[0] as any
      if (node.type && node.type === ELEMENT_TAG && node.value) {
        deleteBackward('block')
        insertText(editor, `#${node.value}`)
      }
    }
    deleteBackward(options)
  }

  return editor
}

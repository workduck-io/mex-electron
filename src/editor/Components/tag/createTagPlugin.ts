import { PlatePlugin, WithOverride, deleteFragment } from '@udecode/plate-core'

import { ELEMENT_TAG } from './defaults'
import { Editor } from 'slate'
import { getTagDeserialize } from './getTagDeserialize'
import { mog } from '../../../utils/lib/helper'

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
export const withTag: WithOverride<any, PlatePlugin> = (editor, { type, options }) => {
  // mog('Setup Plugin with Tag', { type, options })
  const { deleteBackward } = editor

  editor.deleteBackward = (options) => {
    const prev = Editor.previous(editor)
    if (prev[0]) {
      const node = prev[0] as any
      if (node.type && node.type === ELEMENT_TAG && node.value) {
        mog('DeleteForTag', { type, options })
        deleteFragment(editor, { at: prev[1], unit: 'block' })
        Editor.insertText(editor, `#${node.value}`)
      }
    }
    deleteBackward(options)
  }

  return editor
}

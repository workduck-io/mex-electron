import { PlatePlugin, WithOverride, deleteFragment } from '@udecode/plate-core'

import { ELEMENT_MENTION } from './defaults'
import { Editor } from 'slate'
import { getMentionDeserialize } from './getMentionDeserialize'
import { mog } from '../../../utils/lib/helper'

/**
 * Enables support for hypertags.
 */
export const createMentionPlugin = (): PlatePlugin => ({
  key: ELEMENT_MENTION,
  isElement: true,
  deserializeHtml: getMentionDeserialize(),
  isInline: true,
  isVoid: true,
  withOverrides: withMention
})

/**
 *
 * On DeleteBackward:
 * Check if the node above is a Tag and if so, delete it and insert the tag value to be edited by the user
 *
 */
export const withMention: WithOverride<any, PlatePlugin> = (editor, { type, options }) => {
  // mog('Setup Plugin with Tag', { type, options })
  const { deleteBackward } = editor

  editor.deleteBackward = (options) => {
    const prev = Editor.previous(editor)
    if (prev && prev[0]) {
      const node = prev[0] as any
      if (node.type && node.type === ELEMENT_MENTION && node.value) {
        deleteFragment(editor, { at: prev[1], unit: 'block' })
        Editor.insertText(editor, `@${node.value}`)
      }
    }
    deleteBackward(options)
  }

  return editor
}

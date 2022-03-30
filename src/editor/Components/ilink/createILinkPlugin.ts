import { deleteFragment, PlatePlugin, WithOverride } from '@udecode/plate-core'
import { Editor, Range } from 'slate'
import { getPathFromNodeIdHookless } from '../../../hooks/useLinks'
import { useEditorStore } from '../../../store/useEditorStore'
import { mog } from '../../../utils/lib/helper'
import { ComboboxKey } from '../combobox/useComboboxStore'
import { ELEMENT_ILINK } from './defaults'
import { getILinkDeserialize } from './getILinkDeserialize'

/**
 * Enables support for Internal links.
 */
export const createILinkPlugin = (): PlatePlugin => ({
  key: ELEMENT_ILINK,
  isElement: true,
  deserializeHtml: getILinkDeserialize(),
  isInline: true,
  isVoid: true,
  withOverrides: withILink
})

/**
 *
 * On DeleteBackward:
 * Check if the node above is a ILink and if so, delete it and insert the Ilink value to be edited by the user
 *
 */
export const withILink: WithOverride<any, PlatePlugin> = (editor, { type, options }) => {
  // mog('Setup Plugin with ILink', { type, options })
  const { deleteBackward } = editor

  editor.deleteBackward = (options) => {
    const prev = Editor.previous(editor)
    if (prev && prev[0]) {
      const node = prev[0] as any
      if (node.type && node.type === ELEMENT_ILINK && node.value) {
        deleteFragment(editor, { at: prev[1], unit: 'block' })
        const val = getPathFromNodeIdHookless(node.value)

        // * On delete, cursor location
        const start = editor.selection
        const cursor = Range.start(start)

        // * Replace The ILink with the values
        Editor.insertText(editor, `[[${val} `)

        // * Set the cursor to the end of the inserted text
        useEditorStore.getState().setTrigger({ cbKey: ComboboxKey.INTERNAL, trigger: '[[', at: cursor })
      }
    }
    deleteBackward(options)
  }

  return editor
}

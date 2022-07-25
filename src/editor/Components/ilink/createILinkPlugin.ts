import { insertText } from '@udecode/plate'
import { deleteFragment, PlatePlugin, WithOverride, getPreviousNode } from '@udecode/plate-core'
import { Editor, Range } from 'slate'
import { getPathFromNodeIdHookless } from '../../../hooks/useLinks'
import { useEditorStore } from '../../../store/useEditorStore'
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
    const prev = getPreviousNode(editor)
    if (prev && prev[0]) {
      const node = prev[0] as any
      if (node.type && node.type === ELEMENT_ILINK && node.value) {
        deleteFragment(editor, { at: prev[1], unit: 'block' })
        const val = getPathFromNodeIdHookless(node.value)
        mog('value in editor is', { node, val })

        // * On delete, cursor location
        const start = editor.selection
        const cursor = Range.start(start)

        // * Replace The ILink with the values
        insertText(editor, `[[${val} `)

        // * Set the cursor to the end of the inserted text
        useEditorStore
          .getState()
          .setTrigger({ cbKey: ComboboxKey.INTERNAL, blockTrigger: ':', trigger: '[[', at: cursor })
      }
    }
    deleteBackward(options)
  }

  return editor
}

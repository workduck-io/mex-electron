import { getBlockAbove, getPlatePluginType, insertNodes, PEditor, PlateEditor, TElement } from '@udecode/plate'
import { useCallback } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import useAnalytics from '../../../analytics'
import { ActionType } from '../../../analytics/events'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { withoutContinuousDelimiter } from '../../../Lib/helper'
import { getEventNameFromElement } from '../../../Lib/strings'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxOnKeyDown } from '../combobox/hooks/useComboboxOnKeyDown'
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen'
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore'
import { SlashCommandConfig } from '../SlashCommands/Types'
import { useSlashCommandOnChange } from '../SlashCommands/useSlashCommandOnChange'

export interface ComboTypeHandlers {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?) => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const useElementOnChange = (comboType: ComboTypeHandlers) => {
  const isOpen = useComboboxIsOpen()

  const targetRange = useComboboxStore((state) => state.targetRange)
  const parentNodeId = useEditorStore((state) => state.node.key)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const { trackEvent } = useAnalytics()

  return useCallback(
    (editor: PlateEditor, item: IComboboxItem) => {
      const type = getPlatePluginType(editor, comboType.slateElementType)

      if (isOpen && targetRange) {
        // console.log('useElementOnChange 1', { comboType, type });

        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && Editor.isEnd(editor, editor.selection.anchor, pathAbove)

        // console.log('useElementOnChange 2', { type, pathAbove, isBlockEnd });
        // insert a space to fix the bug
        if (isBlockEnd) {
          Transforms.insertText(editor, ' ')
        }

        const { key, isChild } = withoutContinuousDelimiter(item.text)

        let itemValue
        if (key) itemValue = isChild ? `${parentNodeId}${key}` : key
        else itemValue = parentNodeId

        // select the ilink text and insert the ilink element
        Transforms.select(editor, targetRange)
        insertNodes<TElement>(editor, {
          type: type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          children: [{ text: '' }],
          value: itemValue
        })

        trackEvent(getEventNameFromElement('Editor', ActionType.CREATE, type), {
          'mex-element-type': type,
          'mex-element-text': itemValue
        })

        // move the selection after the ilink element
        Transforms.move(editor)

        // delete the inserted space
        if (isBlockEnd) {
          Transforms.delete(editor)
        }

        return closeMenu()
      }
      return undefined
    },
    [closeMenu, isOpen, targetRange, comboType]
  )
}

const useMultiComboboxOnKeyDown = (
  keys: {
    [type: string]: ComboTypeHandlers
  },
  slashCommands: {
    [type: string]: SlashCommandConfig
  }
) => {
  const comboboxKey: string = useComboboxStore((state) => state.key)
  const comboType = keys[comboboxKey]
  const slashCommandOnChange = useSlashCommandOnChange(slashCommands)
  const elementOnChange = useElementOnChange(comboType)

  // We need to create the select handlers ourselves here

  let elementChangeHandler: (editor: PEditor & ReactEditor, item: IComboboxItem) => any
  if (comboboxKey === ComboboxKey.SLASH_COMMAND) {
    elementChangeHandler = slashCommandOnChange
  } else {
    elementChangeHandler = elementOnChange
  }

  return useComboboxOnKeyDown({
    // Handle multiple combobox
    onSelectItem: elementChangeHandler,
    onNewItem: (newItem, parentId?) => {
      comboType.newItemHandler(newItem, parentId)
    },
    creatable: comboboxKey !== ComboboxKey.SLASH_COMMAND
  })
}

export default useMultiComboboxOnKeyDown

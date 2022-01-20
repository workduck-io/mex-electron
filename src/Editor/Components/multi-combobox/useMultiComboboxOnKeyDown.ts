import { getBlockAbove, getPluginType, insertNodes, PEditor, PlateEditor, TElement } from '@udecode/plate'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import useAnalytics from '../../../analytics'
import { ActionType } from '../../../analytics/events'
import { useEditorStore } from '../../Store/EditorStore'
import { withoutContinuousDelimiter } from '../../../Lib/helper'
import { getEventNameFromElement } from '../../../Lib/strings'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxOnKeyDown } from '../combobox/hooks/useComboboxOnKeyDown'
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore'
import { useSlashCommandOnChange } from '../SlashCommands/useSlashCommandOnChange'
import { ComboConfigData, ConfigDataSlashCommands, SingleComboboxConfig } from './multiComboboxContainer'

export interface ComboTypeHandlers {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?) => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const useElementOnChange = (elementComboType: SingleComboboxConfig, keys?: Array<any>) => {
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const { trackEvent } = useAnalytics()

  return (editor: PlateEditor, item: IComboboxItem) => {
    let comboType = elementComboType
    if (keys) {
      const comboboxKey: string = useComboboxStore.getState().key
      comboType = keys[comboboxKey]
    }

    const targetRange = useComboboxStore.getState().targetRange
    const parentNodeId = useEditorStore.getState().node.key
    const type = getPluginType(editor, comboType.slateElementType)

    if (targetRange) {
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

      // console.log('I am the one one the onw', { itemValue, type, key, item })

      // if (item.key === '__create_new' && itemValue.startsWith('Create New')) {
      //   itemValue = itemValue.substring(11)
      // }
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

      // return true
      return closeMenu()
    }
    return undefined
  }
}

export const useOnSelectItem = (
  comboboxKey: string,
  slashCommands: ConfigDataSlashCommands,
  singleComboConfig: SingleComboboxConfig
) => {
  const slashCommandOnChange = useSlashCommandOnChange(slashCommands)
  const elementOnChange = useElementOnChange(singleComboConfig)

  const isSlash = comboboxKey === ComboboxKey.SLASH_COMMAND

  let elementChangeHandler: (editor: PEditor & ReactEditor, item: IComboboxItem) => any

  if (isSlash) {
    elementChangeHandler = slashCommandOnChange
  } else {
    elementChangeHandler = elementOnChange
  }
  return { elementChangeHandler, isSlash }
}

const useMultiComboboxOnKeyDown = (config: ComboConfigData) => {
  return useComboboxOnKeyDown(config)
}

export default useMultiComboboxOnKeyDown

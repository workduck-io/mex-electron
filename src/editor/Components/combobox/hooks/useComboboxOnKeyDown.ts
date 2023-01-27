import { cleanEditorId } from '@editor/Components/Todo'
import useDataStore from '@store/useDataStore'
import { PlateEditor } from '@udecode/plate'
import { insertText, KeyboardHandler, select } from '@udecode/plate-core'
import { mog } from '@utils/lib/mog'
import { findIndex, groupBy } from 'lodash'
import { Editor } from 'slate'

import { isElder } from '../../../../components/mex/Sidebar/treeUtils'
import { SnippetCommandPrefix } from '../../../../hooks/useSnippets'
import { useEditorStore } from '../../../../store/useEditorStore'
import { useSlashCommandOnChange } from '../../SlashCommands/useSlashCommandOnChange'
import { ComboConfigData } from '../../multi-combobox/multiComboboxContainer'
import { ComboSearchType } from '../../multi-combobox/types'
import { CreateNewPrefix } from '../../multi-combobox/useMultiComboboxChange'
import { useElementOnChange as getElementOnChange } from '../../multi-combobox/useMultiComboboxOnKeyDown'
import { IComboboxItem } from '../components/Combobox.types'
import { ComboboxKey, useComboboxStore } from '../useComboboxStore'
import { getNextWrappingIndex } from '../utils/getNextWrappingIndex'

const pure = (id: string) => {
  let newId = id
  if (newId.endsWith(']]')) {
    newId = newId.slice(0, newId.length - 2)
  }
  if (newId.startsWith(CreateNewPrefix)) {
    newId = newId.slice(CreateNewPrefix.length)
  }
  return newId
}

export const isInternalCommand = (search?: string) => {
  if (search !== undefined && search !== '')
    return (
      isElder(search, SnippetCommandPrefix) ||
      SnippetCommandPrefix.startsWith(search)
    )

  return false
}

export type OnSelectItem = (editor: PlateEditor, item: IComboboxItem, elementType?: string, tab?: boolean) => any // eslint-disable-line @typescript-eslint/no-explicit-any
export type OnNewItem = (name: string, parentId?) => string | undefined

export const getCreateableOnSelect = (onSelectItem: OnSelectItem, onNewItem: OnNewItem, creatable?: boolean) => {
  const creatableOnSelect = (editor: any, selectVal: IComboboxItem | string, elementType?: string, tab?: boolean) => {
    const items = useComboboxStore.getState().items
    const editorNoteId = cleanEditorId(editor?.id)
    const currentNodeKey = useDataStore.getState().ilinks.find((l) => l.nodeid === editorNoteId)?.path
    const itemIndex = useComboboxStore.getState().itemIndex
    

    const item = items[itemIndex]

    if (item) {
      // mog('getCreatableInSelect', { item, selectVal, creatable })
      if (item.key === '__create_new' && selectVal) {
        // mog('getCreatableInSelect using OnNewItem', { item, selectVal, creatable })
        const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
        const res = onNewItem(val, editorNoteId)
        if (res) {
          onSelectItem(editor, { key: String(items.length), text: res }, elementType, tab)
        }
      } else {
        // mog('getCreatableInSelect using OnSelectItem', { item, selectVal, creatable })
        onSelectItem(editor, item, elementType, tab)
      }
    } else if (selectVal && creatable) {
      const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
      const res = onNewItem(val, editorNoteId)
      // onSelectItem(editor, { key: String(items.length), text: res ?? val })
      if (res) onSelectItem(editor, { key: String(items.length), text: val }, elementType, tab)
    }
  }

  return creatableOnSelect
}

export const replaceFragment = (editor: any, range: any, text: string) => {
  const sel = editor.selection

  if (sel) {
    select(editor, range)
    insertText(editor, text)
  }
}

/**
 * If the combobox is open, handle keyboard
 */
export const useComboboxOnKeyDown = (config: ComboConfigData): KeyboardHandler => {
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  // We need to create the select handlers ourselves here

  const { keys, slashCommands, internal } = config
  const slashCommandOnChange = useSlashCommandOnChange({ ...slashCommands, ...internal.commands })
  const comboboxKey: string = useComboboxStore.getState().key

  const elementOnChange = getElementOnChange(keys[comboboxKey], keys)

  // * Replace textBeforeTrigger with provided text value in editor

  return (editor) => (e) => {
    const comboboxKey: string = useComboboxStore.getState().key
    const editorNoteId = cleanEditorId(editor?.id)
    const comboType = keys[comboboxKey]

    const itemIndex = useComboboxStore.getState().itemIndex
    const isBlockTriggered = useComboboxStore.getState().isBlockTriggered
    const { textAfterTrigger: search }: ComboSearchType = useComboboxStore.getState().search
    const items = useComboboxStore.getState().items
    const targetRange = useComboboxStore.getState().targetRange
    const isOpen = !!targetRange && items.length > 0
    const item = items[itemIndex]

    const isSlashCommand =
      comboType.slateElementType === ComboboxKey.SLASH_COMMAND ||
      (comboType.slateElementType === ComboboxKey.INTERNAL && isInternalCommand(item ? item.key : search))

    // * Is Command is "/" or "[[", select corresponding change handler
    const onSelectItemHandler = isSlashCommand ? slashCommandOnChange : elementOnChange

    const creatabaleOnSelect = getCreateableOnSelect(
      onSelectItemHandler,
      (newItem, parentId?) => {
        if (comboboxKey === ComboboxKey.INTERNAL && !isInternalCommand(search)) {
          return internal.ilink.newItemHandler(newItem, editorNoteId)
        }

        if (comboType) {
          // mog('comoboType', { newItem, comboType, parentId })
          return comboType.newItemHandler(newItem, editorNoteId)
        }
      },
      comboboxKey !== ComboboxKey.SLASH_COMMAND
    )

    const groups = Object.keys(groupBy(items, (n) => n.type))
    const indexes = groups.map((gn) => findIndex(items, (n: any) => n.type === gn))

    if (isOpen) {
      if (!isBlockTriggered) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()

          if (e.metaKey) {
            for (let i = 0; i < indexes.length; i++) {
              const categoryIndex = indexes[i]
              if (categoryIndex > itemIndex && items[categoryIndex].type !== items[itemIndex].type) {
                return setItemIndex(categoryIndex)
              }
            }
          } else {
            const newIndex = getNextWrappingIndex(1, itemIndex, items.length, () => undefined, false)
            return setItemIndex(newIndex)
          }
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()

          if (e.metaKey) {
            for (let i = indexes[indexes.length - 1]; i > -1; i--) {
              const categoryIndex = indexes[i]
              if (categoryIndex < itemIndex && items[categoryIndex].type !== items[itemIndex].type) {
                return setItemIndex(categoryIndex)
              }
            }
          } else {
            const newIndex = getNextWrappingIndex(-1, itemIndex, items.length, () => undefined, false)
            return setItemIndex(newIndex)
          }
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          return closeMenu()
        }
      }

      if (e.key === 'Tab') {
        // * On Tab insert the selected item as Inline Block
        e.preventDefault()
        creatabaleOnSelect(editor, search, undefined, true)
        return false
      }
      // }

      if (['Enter', ']'].includes(e.key)) {
        e.preventDefault()

        // * On Enter insert the selected item
        creatabaleOnSelect(editor, search)
        return false
      }
    }
    return false
  }
}

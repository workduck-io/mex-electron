import {
  deleteText,
  getBlockAbove,
  getPluginType,
  insertNodes,
  insertText,
  isBlock,
  isEndPoint,
  moveSelection,
  PlateEditor,
  select,
  TElement,
  Value
} from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import { QuickLinkType } from '../../../components/mex/NodeSelect/NodeSelect'
import { NODE_ID_PREFIX } from '../../../data/Defaults/idPrefixes'
import { useLinks } from '../../../hooks/useLinks'
import useAnalytics from '../../../services/analytics'
import { ActionType } from '../../../services/analytics/events'
import { getEventNameFromElement, getSlug } from '../../../utils/lib/strings'
import { IComboboxItem, InsertableElement } from '../combobox/components/Combobox.types'
import { isInternalCommand, useComboboxOnKeyDown } from '../combobox/hooks/useComboboxOnKeyDown'
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore'
import { ELEMENT_ILINK } from '../ilink/defaults'
import { ELEMENT_INLINE_BLOCK } from '../InlineBlock/types'
import { useSlashCommandOnChange } from '../SlashCommands/useSlashCommandOnChange'
import { ComboConfigData, ConfigDataSlashCommands, SingleComboboxConfig } from './types'
import { ComboSearchType } from './types'



export const useElementOnChange = (elementComboType: SingleComboboxConfig, keys?: any) => {
  const { trackEvent } = useAnalytics()
  const { getNodeidFromPath } = useLinks()
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  return (editor: PlateEditor, item: IComboboxItem, elementType?: string, tab?: boolean) => {
    try {
      let comboType = elementComboType
      if (keys) {
        const comboboxKey: string = useComboboxStore.getState().key
        comboType = keys[comboboxKey]
      }

      const targetRange = useComboboxStore.getState().targetRange
      // mog('Target Range', { targetRange })

      mog('ELEMENT', { elementType, comboType })

      let type =
        elementType ??
        getPluginType(editor, comboType.slateElementType === 'internal' ? 'ilink' : comboType.slateElementType)

      if (tab) {
        // console.log('TAB', { comboType, type })
        type = type === ELEMENT_ILINK ? ELEMENT_INLINE_BLOCK : type
        mog('TYPE OF ELEMENT CHANGED TO INLINEEEE BLOCKKKK')
        // if (type)
      }

      if (targetRange) {
        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && isEndPoint(editor, editor.selection.anchor, pathAbove)

        // insert a space to fix the bug
        if (isBlockEnd) {
          insertText(editor, ' ')
        }

        let itemValue = item.text

        if ((type === ELEMENT_ILINK || type === ELEMENT_INLINE_BLOCK) && !itemValue?.startsWith(`${NODE_ID_PREFIX}_`)) {
          // mog('Replacing itemValue', { comboType, type, itemValue, item })

          const nodeId = getNodeidFromPath(itemValue)
          mog('Value of Item', { itemValue })
          itemValue = nodeId
        }

        // select the ilink text and insert the ilink element
        select(editor, targetRange)
        // mog('Inserting Element', { comboType, type, itemValue, item })

        const isBlockTriggered = useComboboxStore.getState().isBlockTriggered
        const activeBlock = useComboboxStore.getState().activeBlock
        const textAfterBlockTrigger = useComboboxStore.getState().search.textAfterBlockTrigger

        // mog('Inserting from here', { item, isBlockTriggered })
        let InsertedElement: InsertableElement = {
          type,
          children: [{ text: '' }],
          value: itemValue ?? item.key
        }
        if (
          (item.type === QuickLinkType.backlink || type === ELEMENT_INLINE_BLOCK) &&
          isBlockTriggered &&
          activeBlock
        ) {
          const blockValue = activeBlock?.text ? getSlug(activeBlock.text) : ''
          InsertedElement = {
            ...InsertedElement,
            type,
            children: [{ text: '' }],
            value: activeBlock?.id,
            blockValue,
            blockId: activeBlock?.blockId
          }
        } else if (item.type === QuickLinkType.mentions) {
          InsertedElement = {
            ...InsertedElement,
            value: item.key
          }
          if (comboType.onItemInsert && tab !== true) comboType.onItemInsert(item.text)
        } else {
          if (item.type === QuickLinkType.flow || item.type === QuickLinkType.snippet) {
            itemValue = item.key
          }

          InsertedElement = {
            ...InsertedElement,
            value: itemValue
          }
        }
        if (item.additional) {
          InsertedElement = { ...InsertedElement, ...item.additional }
        }

        // mog('Inserting', { InsertedElement })

        insertNodes<TElement>(editor, InsertedElement)
        trackEvent(getEventNameFromElement('Editor', ActionType.CREATE, type), {
          'mex-element-type': type,
          'mex-element-text': itemValue
        })

        // move the selection after the ilink element
        moveSelection(editor)
        const isBlockComponent = isBlock(editor, InsertedElement)

        if (isBlockEnd && !isBlockComponent) {
          // delete the inserted space
          deleteText(editor, { unit: 'character', reverse: true })
        }

        // return true
        return closeMenu()
      }
    } catch (e) {
      console.error(e)
    }
    return undefined
  }
}

export const useOnSelectItem = (
  comboboxKey: string,
  slashCommands: ConfigDataSlashCommands,
  singleComboConfig: SingleComboboxConfig,
  commands: ConfigDataSlashCommands
) => {
  const slashCommandOnChange = useSlashCommandOnChange({ ...slashCommands, ...commands })
  const elementOnChange = useElementOnChange(singleComboConfig)

  const search: ComboSearchType = useComboboxStore.getState().search
  const isSlashTrigger = useComboboxStore((store) => store.isSlash)
  const isSlash =
    isSlashTrigger ||
    comboboxKey === ComboboxKey.SLASH_COMMAND ||
    (comboboxKey === ComboboxKey.INTERNAL && isInternalCommand(search.textAfterTrigger))

  let elementChangeHandler: (editor: PlateEditor<Value>, item: IComboboxItem) => any

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

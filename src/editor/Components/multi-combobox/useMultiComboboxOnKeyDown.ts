import { getBlockAbove, getPluginType, insertNodes, PEditor, PlateEditor, TElement } from '@udecode/plate'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { QuickLinkType } from '../../../components/mex/NodeSelect/NodeSelect'
import { NODE_ID_PREFIX } from '../../../data/Defaults/idPrefixes'
import { useLinks } from '../../../hooks/useLinks'
import useAnalytics from '../../../services/analytics'
import { ActionType } from '../../../services/analytics/events'
import { getEventNameFromElement } from '../../../utils/lib/strings'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { isInternalCommand, useComboboxOnKeyDown } from '../combobox/hooks/useComboboxOnKeyDown'
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore'
import { ELEMENT_ILINK } from '../ilink/defaults'
import { ELEMENT_INLINE_BLOCK } from '../InlineBlock/types'
import { useSlashCommandOnChange } from '../SlashCommands/useSlashCommandOnChange'
import { ComboConfigData, ConfigDataSlashCommands, SingleComboboxConfig } from './multiComboboxContainer'
import { ComboSearchType } from './types'

export interface ComboTypeHandlers {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?) => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const useElementOnChange = (elementComboType: SingleComboboxConfig, keys?: any) => {
  const { trackEvent } = useAnalytics()
  const { getNodeidFromPath } = useLinks()
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  return (editor: PlateEditor, item: IComboboxItem, elementType?: string) => {
    try {
      let comboType = elementComboType
      if (keys) {
        const comboboxKey: string = useComboboxStore.getState().key
        comboType = keys[comboboxKey]
      }

      const targetRange = useComboboxStore.getState().targetRange
      // mog('Target Range', { targetRange })

      // mog('ELEMENT', { elementType, comboType })

      const type =
        elementType ??
        getPluginType(editor, comboType.slateElementType === 'internal' ? 'ilink' : comboType.slateElementType)

      if (targetRange) {
        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && Editor.isEnd(editor, editor.selection.anchor, pathAbove)

        // insert a space to fix the bug
        if (isBlockEnd) {
          Transforms.insertText(editor, ' ')
        }

        let itemValue = item.text

        if ((type === ELEMENT_ILINK || type === ELEMENT_INLINE_BLOCK) && !itemValue.startsWith(`${NODE_ID_PREFIX}_`)) {
          // mog('Replacing itemValue', { comboType, type, itemValue, item })

          const nodeId = getNodeidFromPath(itemValue)
          itemValue = nodeId
        }

        // select the ilink text and insert the ilink element
        Transforms.select(editor, targetRange)
        // mog('Inserting Element', { comboType, type, itemValue, item })

        const isBlockTriggered = useComboboxStore.getState().isBlockTriggered
        const activeBlock = useComboboxStore.getState().activeBlock
        const textAfterBlockTrigger = useComboboxStore.getState().search.textAfterBlockTrigger

        // mog('Inserting from here', { activeBlock, isBlockTriggered })
        if ((item.type === QuickLinkType.ilink || type === ELEMENT_INLINE_BLOCK) && isBlockTriggered && activeBlock) {
          const withBlockInfo = {
            type,
            children: [{ text: '' }],
            value: activeBlock.id,
            blockValue: activeBlock.text,
            blockId: activeBlock.blockId
          }

          insertNodes(editor, withBlockInfo)
        } else {
          if (item.type === QuickLinkType.flow || item.type === QuickLinkType.snippet) {
            itemValue = item.key
          }

          insertNodes<TElement>(editor, {
            type,
            children: [{ text: '' }],
            value: itemValue
          })
        }

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

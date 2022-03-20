import {
  ComboboxItem,
  ComboboxRoot,
  ItemCenterWrapper,
  ItemDesc,
  ItemRightIcons,
  ItemTitle
} from '../../tag/components/TagCombobox.styles'
import { PortalBody, getPreventDefaultHandler, useEditorState } from '@udecode/plate'
import React, { useEffect, useState } from 'react'

import { ComboboxProps } from './Combobox.types'
import { Icon } from '@iconify/react'
import { setElementPositionByRange } from '../../tag/utils/setElementPositionByRange'
import { useComboboxControls } from '../hooks/useComboboxControls'
import { useComboboxIsOpen } from '../selectors/useComboboxIsOpen'
import { useComboboxStore } from '../useComboboxStore'
import useMergedRef from '@react-hook/merged-ref'
import EditorPreviewRenderer from '../../../EditorPreviewRenderer'
import { QuickLinkType } from '../../../../components/mex/NodeSelect/NodeSelect'
import { useContentStore } from '../../../../store/useContentStore'
import { PrimaryText } from '../../../../style/Integration'
import { useSnippets } from '../../../../hooks/useSnippets'
import { ActionTitle } from '../../../../components/spotlight/Actions/styled'
import { NodeEditorContent } from '../../../../types/Types'
import BlockCombo from './BlockCombo'
import { ComboboxShortcuts, ComboSeperator } from './styled'
import { ElementTypeBasedShortcut } from '../../../../components/spotlight/Shortcuts/list'
import { ShortcutText } from '../../../../components/spotlight/Home/components/Item'
import { DisplayShortcut } from '../../../../components/mex/Shortcuts'
import { replaceFragment } from '../hooks/useComboboxOnKeyDown'

export const Combobox = ({ onSelectItem, onRenderItem }: ComboboxProps) => {
  // TODO clear the error-esque warnings for 'type inference'

  const at = useComboboxStore((state) => state.targetRange)
  const items = useComboboxStore((state) => state.items)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const targetRange = useComboboxStore((state) => state.targetRange)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)
  const activeBlock = useComboboxStore((store) => store.activeBlock)
  const preview = useComboboxStore((store) => store.preview)
  const setPreview = useComboboxStore((store) => store.setPreview)
  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()
  const textAfterTrigger = useComboboxStore((store) => store.search.textAfterTrigger)
  const getContent = useContentStore((store) => store.getContent)
  const { getSnippetContent } = useSnippets()

  const ref = React.useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const editor = useEditorState()

  useEffect(() => {
    // Throws error when the combobox is open and editor is switched or removed
    try {
      if (editor) setElementPositionByRange(editor, { ref, at })
    } catch (e) {
      closeMenu()
      console.error(e)
    }
  }, [at, editor])

  const menuProps = combobox ? combobox.getMenuProps() : { ref: null }

  const multiRef = useMergedRef(menuProps.ref, ref)

  const comboProps = (item, index) => {
    if (combobox) {
      return combobox.getItemProps({
        item,
        index
      })
    }
  }

  useEffect(() => {
    if (editor && items?.[itemIndex] && textAfterTrigger.trim() && isBlockTriggered) {
      replaceFragment(editor, targetRange, `[[${items[itemIndex].text}:`)
    }
  }, [isBlockTriggered])

  useEffect(() => {
    const comboItem = items[itemIndex]

    if (comboItem && comboItem.type && isOpen) {
      const { key, type } = comboItem

      let content: NodeEditorContent | undefined

      if (type === QuickLinkType.ilink) {
        content = getContent(key)?.content
      } else if (type === QuickLinkType.snippet) {
        content = getSnippetContent(key)
      }
      if (!activeBlock) setPreview(content)
    }
  }, [itemIndex, items, activeBlock, isOpen])

  if (!combobox) return null

  const listItem = items[itemIndex]
  const itemShortcut = listItem?.type ? ElementTypeBasedShortcut[listItem?.type] : undefined

  return (
    <PortalBody>
      <ComboboxRoot {...menuProps} ref={multiRef} isOpen={isOpen}>
        {!isBlockTriggered && (
          <div id="List" style={{ flex: 1 }}>
            {items.map((item, index) => {
              const Item = onRenderItem ? onRenderItem({ item }) : item.text
              const lastItem = index > 0 ? items[index - 1] : undefined

              return (
                <span key={`${item.key}-${String(index)}`}>
                  {item.type !== lastItem?.type && <ActionTitle>{item.type}</ActionTitle>}
                  <ComboboxItem
                    className={index === itemIndex ? 'highlight' : ''}
                    {...comboProps(item, index)}
                    onMouseEnter={() => {
                      setItemIndex(index)
                    }}
                    onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, item)}
                  >
                    {item.icon && <Icon height={18} key={`${item.key}_${item.icon}`} icon={item.icon} />}
                    <ItemCenterWrapper>
                      {!item.prefix ? (
                        <ItemTitle>{Item}</ItemTitle>
                      ) : (
                        <ItemTitle>
                          {item.prefix} <PrimaryText>{Item}</PrimaryText>
                        </ItemTitle>
                      )}
                      {item.desc && <ItemDesc>{item.desc}</ItemDesc>}
                    </ItemCenterWrapper>
                    {item.rightIcons && (
                      <ItemRightIcons>
                        {item.rightIcons.map((i: string) => (
                          <Icon key={item.key + i} icon={i} />
                        ))}
                      </ItemRightIcons>
                    )}
                  </ComboboxItem>
                </span>
              )
            })}
            {itemShortcut && (
              <ComboboxShortcuts>
                {Object.entries(itemShortcut).map(([key, shortcut]) => {
                  return (
                    <ShortcutText key={key}>
                      <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
                    </ShortcutText>
                  )
                })}
              </ComboboxShortcuts>
            )}
          </div>
        )}
        <BlockCombo nodeId={items[itemIndex]?.key} isNew={items[itemIndex]?.data} />
        {preview && items[itemIndex]?.type === QuickLinkType.ilink && (
          <ComboSeperator>
            <EditorPreviewRenderer
              content={preview}
              editorId={isBlockTriggered && activeBlock ? activeBlock.blockId : items[itemIndex]?.key}
            />
          </ComboSeperator>
        )}
      </ComboboxRoot>
    </PortalBody>
  )
}

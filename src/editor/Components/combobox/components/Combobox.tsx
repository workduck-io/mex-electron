import { DEFAULT_LIST_ITEM_ICON } from '@components/spotlight/ActionStage/ActionMenu/ListSelector'
import { getIconType, ProjectIconMex } from '@components/spotlight/ActionStage/Project/ProjectIcon'
import usePointerMovedSinceMount from '@hooks/listeners/usePointerMovedSinceMount'
import { Icon } from '@iconify/react'
import { FloatingOverlay, shift, offset, flip } from '@floating-ui/react-dom-interactions'
import { getRangeBoundingClientRect, PortalBody, useEditorState, useVirtualFloating } from '@udecode/plate'
import { DisplayShortcut } from '@workduck-io/mex-components'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { QuickLinkType } from '../../../../components/mex/NodeSelect/NodeSelect'
import { ActionTitle } from '../../../../components/spotlight/Actions/styled'
import { ShortcutText } from '../../../../components/spotlight/Home/components/Item'
import { ElementTypeBasedShortcut } from '../../../../components/spotlight/Shortcuts/list'
import { useSnippets } from '../../../../hooks/useSnippets'
import { useContentStore } from '../../../../store/useContentStore'
import { PrimaryText } from '../../../../style/Integration'
import { NodeEditorContent } from '../../../../types/Types'
import EditorPreviewRenderer from '../../../EditorPreviewRenderer'
import {
  ComboboxItem,
  ComboboxRoot,
  ItemCenterWrapper,
  ItemDesc,
  ItemRightIcons,
  ItemTitle
} from '../../tag/components/TagCombobox.styles'
import { useComboboxControls } from '../hooks/useComboboxControls'
import { replaceFragment } from '../hooks/useComboboxOnKeyDown'
import { useComboboxIsOpen } from '../selectors/useComboboxIsOpen'
import { useComboboxStore } from '../useComboboxStore'
import BlockCombo from './BlockCombo'
import { ComboboxProps } from './Combobox.types'
import PreviewMeta from './PreviewMeta'
import { ComboboxShortcuts, ComboSeperator } from './styled'
import { mog } from '@utils/lib/helper'

export const Combobox = ({ onSelectItem, onRenderItem }: ComboboxProps) => {
  // TODO clear the error-esque warnings for 'type inference'

  const items = useComboboxStore((state) => state.items)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const targetRange = useComboboxStore((state) => state.targetRange)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)
  const activeBlock = useComboboxStore((store) => store.activeBlock)
  const preview = useComboboxStore((store) => store.preview)
  const setPreview = useComboboxStore((store) => store.setPreview)
  const search = useComboboxStore((store) => store.search)
  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()

  const { textAfterTrigger, textAfterBlockTrigger } = useComboboxStore((store) => store.search)
  const getContent = useContentStore((store) => store.getContent)
  const { getSnippetContent } = useSnippets()
  const setIsSlash = useComboboxStore((store) => store.setIsSlash)
  const [metaData, setMetaData] = useState(undefined)
  const editor = useEditorState()
  const theme = useTheme()

  const menuProps = combobox ? combobox.getMenuProps({}, { suppressRefError: true }) : { ref: null }

  const comboProps = (item, index) => {
    if (combobox) {
      return combobox.getItemProps({
        item,
        index
      })
    }
  }

  useEffect(() => {
    if (items?.[itemIndex]?.type === QuickLinkType.snippet) {
      setIsSlash(true)
    } else {
      setIsSlash(false)
    }
  }, [itemIndex])

  useEffect(() => {
    if (editor && items?.[itemIndex] && textAfterTrigger.trim() && isBlockTriggered) {
      replaceFragment(editor, targetRange, `[[${items[itemIndex].text}:`)
      setItemIndex(0)
    }

    if (isBlockTriggered) {
      setPreview(undefined)
    }
  }, [isBlockTriggered])

  useEffect(() => {
    return () => closeMenu()
  }, [])

  useEffect(() => {
    const comboItem = items[itemIndex]

    if (comboItem && comboItem.type && isOpen) {
      const { key, type } = comboItem

      let content: NodeEditorContent | undefined

      if (type === QuickLinkType.backlink) {
        const nodeContent = getContent(key)
        content = nodeContent?.content

        setMetaData(nodeContent?.metadata)
      } else if (type === QuickLinkType.snippet) {
        content = getSnippetContent(key)
      }

      if (!activeBlock) setPreview(content)
      if (isBlockTriggered && !textAfterBlockTrigger) {
        setPreview(undefined)
      }
    }
  }, [itemIndex, items, activeBlock, isOpen, search])

  const pointerMoved = usePointerMovedSinceMount()

  const getBoundingClientRect = useCallback(
    () => getRangeBoundingClientRect(editor, targetRange),
    [editor, targetRange]
  )

  // Update popper position
  const { style, floating } = useVirtualFloating({
    placement: 'bottom-start',
    getBoundingClientRect,
    middleware: [offset(4), shift(), flip()]
  })

  if (!combobox) return null

  const listItem = items[itemIndex]
  const itemShortcut = listItem?.type ? ElementTypeBasedShortcut[listItem?.type] : undefined

  return (
    <PortalBody>
      {isOpen && (
        <ComboboxRoot {...menuProps} ref={floating} style={style} isOpen={isOpen}>
          <>
            {!isBlockTriggered && (
              <div id="List" style={{ flex: 1 }}>
                <section id="items-container">
                  {items.map((item, index) => {
                    const Item = onRenderItem ? onRenderItem({ item }) : item.text
                    const lastItem = index > 0 ? items[index - 1] : undefined
                    const { mexIcon } = getIconType(item?.icon ?? DEFAULT_LIST_ITEM_ICON)

                    return (
                      <span key={`${item.key}-${String(index)}`}>
                        {item.type !== lastItem?.type && <ActionTitle>{item.type}</ActionTitle>}
                        <ComboboxItem
                          className={index === itemIndex ? 'highlight' : ''}
                          {...comboProps(item, index)}
                          onPointerMove={() => pointerMoved && setItemIndex(index)}
                          onMouseDown={() => {
                            editor && onSelectItem(editor, item)
                          }}
                        >
                          {item.icon && (
                            <ProjectIconMex
                              isMex={mexIcon}
                              size={14}
                              key={`${item.key}_${item.icon}`}
                              icon={item.icon}
                              margin="0 0.25rem 0 0"
                              color={theme.colors.primary}
                            />
                          )}
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
                </section>
                {itemShortcut && (
                  <ComboboxShortcuts>
                    {Object.entries(itemShortcut).map(([key, shortcut]) => {
                      return (
                        <ShortcutText key={key}>
                          <DisplayShortcut shortcut={shortcut.keystrokes} />{' '}
                          <div className="text">{shortcut.title}</div>
                        </ShortcutText>
                      )
                    })}
                  </ComboboxShortcuts>
                )}
              </div>
            )}
            <BlockCombo
              onSelect={() => {
                const item = items[itemIndex]
                if (item?.type === QuickLinkType.backlink) {
                  editor && onSelectItem(editor, items[itemIndex])
                }
              }}
              shortcuts={itemShortcut}
              nodeId={items[itemIndex]?.key}
              isNew={items[itemIndex]?.data}
            />
            {((preview && listItem?.type && !isBlockTriggered) ||
              (isBlockTriggered && textAfterBlockTrigger && preview)) && (
              <ComboSeperator>
                <section>
                  <EditorPreviewRenderer
                    noMouseEvents
                    content={preview?.content || preview}
                    readOnly
                    editorId={isBlockTriggered && activeBlock ? activeBlock.blockId : items[itemIndex]?.key}
                  />
                </section>
                {preview && <PreviewMeta meta={metaData} />}
              </ComboSeperator>
            )}
          </>
        </ComboboxRoot>
      )}
    </PortalBody>
  )
}

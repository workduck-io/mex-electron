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

export const Combobox = ({ onSelectItem, onRenderItem }: ComboboxProps) => {
  // TODO clear the error-esque warnings for 'type inference'
  const at = useComboboxStore((state) => state.targetRange)
  const items = useComboboxStore((state) => state.items)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)

  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()
  const [preview, setPreview] = useState(undefined)
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
    const comboItem = items[itemIndex]

    if (comboItem && comboItem.type) {
      const { key, type } = comboItem

      let content: NodeEditorContent | undefined

      if (type === QuickLinkType.ilink) {
        content = getContent(key)?.content
      } else if (type === QuickLinkType.snippet) {
        content = getSnippetContent(key)
      }

      setPreview(content)
    }
  }, [itemIndex, items])

  if (!combobox) return null

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
          </div>
        )}
        <BlockCombo />
        {items[itemIndex]?.type && preview && !isBlockTriggered && (
          <div style={{ maxHeight: '400px', marginLeft: '0.5rem', width: '220px', overflow: 'hidden' }}>
            <EditorPreviewRenderer content={preview} editorId={items[itemIndex]?.key + String(itemIndex)} />
          </div>
        )}
      </ComboboxRoot>
    </PortalBody>
  )
}

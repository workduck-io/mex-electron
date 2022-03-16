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
import { mog } from '../../../../utils/lib/helper'
import EditorPreviewRenderer from '../../../EditorPreviewRenderer'
import { QuickLinkType } from '../../../../components/mex/NodeSelect/NodeSelect'
import useDataStore from '../../../../store/useDataStore'
import { useContentStore } from '../../../../store/useContentStore'
import { defaultContent } from '../../../../data/Defaults/baseData'
import { Flex } from '../../../../style/Integration'
import { useSnippets } from '../../../../hooks/useSnippets'
import { ActionTitle } from '../../../../components/spotlight/Actions/styled'

export const Combobox = ({ onSelectItem, onRenderItem, isSlash }: ComboboxProps) => {
  // TODO clear the error-esque warnings for 'type inference'
  const at = useComboboxStore((state) => state.targetRange)
  const items = useComboboxStore((state) => state.items)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()
  const [preview, setPreview] = useState(defaultContent?.content)
  const getContent = useContentStore((store) => store.getContent)
  const { getSnippetContent } = useSnippets()

  const ref = React.useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const editor = useEditorState()
  // const _editor = usePlateEditorState(usePlateEventId('focus'));
  // console.log(editor === _editor);

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

    if (comboItem) {
      const { key, type } = comboItem

      if (type === QuickLinkType.ilink) {
        const cont = getContent(key)

        setPreview(cont?.content)
      } else if (type === QuickLinkType.snippet) {
        const con = getSnippetContent(key)

        mog('value is', { item: items[itemIndex], con })
        setPreview(con)
      }
    }
  }, [itemIndex, items])

  if (!combobox) return null

  return (
    <PortalBody>
      <ComboboxRoot {...menuProps} ref={multiRef} isOpen={isOpen}>
        <div>
          {isOpen &&
            items.map((item, index) => {
              const Item = onRenderItem ? onRenderItem({ item }) : item.text
              const lastItem = index > 0 ? items[index - 1] : undefined

              return (
                <>
                  {item.type !== lastItem?.type && <ActionTitle>{item.type}</ActionTitle>}
                  <ComboboxItem
                    key={`${item.key}-${String(index)}`}
                    className={index === itemIndex ? 'highlight' : ''}
                    {...comboProps(item, index)}
                    onMouseEnter={() => {
                      setItemIndex(index)
                    }}
                    onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, item)}
                  >
                    {item.icon && <Icon height={18} key={`${item.key}_${item.icon}`} icon={item.icon} />}
                    <ItemCenterWrapper>
                      <ItemTitle>{Item}</ItemTitle>
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
                </>
              )
            })}
        </div>
        <div style={{ minHeight: '400px', maxHeight: '400px', width: '100%', overflow: 'scroll' }}>
          {items[itemIndex]?.type && preview && (
            <EditorPreviewRenderer content={preview} editorId={items[itemIndex]?.key + String(itemIndex)} />
          )}
        </div>
      </ComboboxRoot>
    </PortalBody>
  )
}

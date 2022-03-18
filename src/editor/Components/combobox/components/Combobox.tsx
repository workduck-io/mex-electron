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
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'

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
import { useContentStore } from '../../../../store/useContentStore'
import { PrimaryText } from '../../../../style/Integration'
import { useSnippets } from '../../../../hooks/useSnippets'
import { ActionTitle } from '../../../../components/spotlight/Actions/styled'
import { ComboSearchType } from '../../multi-combobox/types'
import { getBlocks } from '../../../../utils/helpers'
import { NodeEditorContent } from '../../../../types/Types'
import { MexIcon } from '../../../../style/Layouts'
import styled, { useTheme } from 'styled-components'
import IconButton, { Button } from '../../../../style/Buttons'
import { search as getSearchResults } from 'fast-fuzzy'
import { useSearch } from '../../../../hooks/useSearch'

const StyledComboHeader = styled(ComboboxItem)`
  padding: 0.2rem 0;
  margin: 0.25rem 0;

  ${Button} {
    padding: 0.25rem;
    margin: 0 0.5rem 0 0;
  }
`

export const Combobox = ({ onSelectItem, onRenderItem }: ComboboxProps) => {
  // TODO clear the error-esque warnings for 'type inference'
  const at = useComboboxStore((state) => state.targetRange)
  const items = useComboboxStore((state) => state.items)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const search: ComboSearchType = useComboboxStore((store) => store.search)
  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)

  const combobox = useComboboxControls(true)
  const isOpen = useComboboxIsOpen()
  const [preview, setPreview] = useState(undefined)
  const [blocks, setBlocks] = useState<Array<{ block: any; desc: string }>>(undefined)
  const getContent = useContentStore((store) => store.getContent)
  const { getSnippetContent } = useSnippets()

  const theme = useTheme()

  const ref = React.useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const editor = useEditorState()
  // const _editor = usePlateEditorState(usePlateEventId('focus'));
  // console.log(editor === _editor);

  const { queryIndexByNodeId } = useSearch()

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

      if (content) {
        const blocks = getBlocks(content)
        setPreview(content)
        if (blocks) setBlocks(Object.values(blocks))
      } else {
        setPreview(undefined)
        setBlocks(undefined)
      }
    }
  }, [itemIndex, items])

  useEffect(() => {
    async function getBlockSearchRes() {
      const trimmedSearch = search.textAfterBlockTrigger?.trim()
      if (blocks && trimmedSearch && items[itemIndex]) {
        const blockSearchRes = await queryIndexByNodeId('node', items[itemIndex].key, trimmedSearch)
        mog('BlockSearchFlexRes', { blockSearchRes })

        const res = getSearchResults(trimmedSearch, blocks, { keySelector: (obj) => obj.desc })
        // mog('Searching something', { blocks, res, tr: trimmedSearch }, { pretty: true, collapsed: false })
        setBlocks(res)
        // if (res && res.length > 0) setPreview(res[0].block)
        // else setPreview(undefined)
      }
    }
    getBlockSearchRes()
  }, [search.textAfterBlockTrigger])

  if (!combobox) return null

  return (
    // <PortalBody>
    //   <ComboboxRoot {...menuProps} ref={multiRef} isOpen={isOpen}>
    //     <div>
    //       {isOpen &&
    //         !isBlockTriggered &&
    //         items.map((item, index) => {
    //           const Item = onRenderItem ? onRenderItem({ item }) : item.text
    //           const lastItem = index > 0 ? items[index - 1] : undefined

    //           return (
    //             <span key={`${item.key}-${String(index)}`}>
    //               {item.type !== lastItem?.type && <ActionTitle>{item.type}</ActionTitle>}
    //               <ComboboxItem
    //                 className={index === itemIndex ? 'highlight' : ''}
    //                 {...comboProps(item, index)}
    //                 onMouseEnter={() => {
    //                   setItemIndex(index)
    //                 }}
    //                 onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, item)}
    //               >
    //                 {item.icon && <Icon height={18} key={`${item.key}_${item.icon}`} icon={item.icon} />}
    //                 <ItemCenterWrapper>
    //                   {!item.prefix ? (
    //                     <ItemTitle>{Item}</ItemTitle>
    //                   ) : (
    //                     <ItemTitle>
    //                       {item.prefix} <PrimaryText>{Item}</PrimaryText>
    //                     </ItemTitle>
    //                   )}
    //                   {item.desc && <ItemDesc>{item.desc}</ItemDesc>}
    //                 </ItemCenterWrapper>
    //                 {item.rightIcons && (
    //                   <ItemRightIcons>
    //                     {item.rightIcons.map((i: string) => (
    //                       <Icon key={item.key + i} icon={i} />
    //                     ))}
    //                   </ItemRightIcons>
    //                 )}
    //               </ComboboxItem>
    //             </span>
    //           )
    //         })}
    //     </div>
    //     {isBlockTriggered && (
    //       <>
    //         <div style={{ marginLeft: '8px', maxHeight: '400px', width: '100%', overflow: 'scroll' }}>
    //           <StyledComboHeader key="random">
    //             <IconButton
    //               size={16}
    //               shortcut={`Esc`}
    //               icon={arrowLeftLine}
    //               onClick={() => setBlocks(undefined)}
    //               title={'Back to Quick links'}
    //             />
    //             <ItemTitle>
    //               {`In ${items[itemIndex]?.text}: `}
    //               <PrimaryText>{search.textAfterBlockTrigger}</PrimaryText>
    //             </ItemTitle>
    //           </StyledComboHeader>

    //           {blocks?.length === 0 && (
    //             <ComboboxItem
    //               key={`Nothing found`}
    //               className="highlight"
    //               // {...comboProps(item, index)}
    //               // onMouseEnter={() => {
    //               //   setItemIndex(index)
    //               // }}
    //               // onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, block)}
    //             >
    //               <ItemCenterWrapper>No block found! Create new </ItemCenterWrapper>
    //             </ComboboxItem>
    //           )}

    //           {blocks?.map(({ block, desc }, index) => (
    //             <ComboboxItem
    //               key={`${block.id}-${String(index)}`}
    //               className={index === itemIndex ? 'highlight' : ''}
    //               // {...comboProps(item, index)}
    //               // onMouseEnter={() => {
    //               //   setItemIndex(index)
    //               // }}
    //               // onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, block)}
    //             >
    //               <MexIcon fontSize={24} icon="ph:squares-four-fill" color={theme.colors.primary} />
    //               <ItemCenterWrapper>
    //                 {/* <ItemTitle>{block.type}</ItemTitle> */}
    //                 {desc && <ItemDesc>{desc}</ItemDesc>}
    //               </ItemCenterWrapper>
    //             </ComboboxItem>
    //           ))}
    //         </div>
    //       </>
    //     )}
    //     {items[itemIndex]?.type && preview && !isBlockTriggered && (
    //       <div style={{ maxHeight: '400px', width: '100%', overflow: 'scroll' }}>
    //         <EditorPreviewRenderer content={preview} editorId={items[itemIndex]?.key + String(itemIndex)} />
    //       </div>
    //     )}
    //   </ComboboxRoot>
    // </PortalBody>
    <></>
  )
}

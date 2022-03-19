import React, { useEffect, useState } from 'react'
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { MexIcon } from '../../../../style/Layouts'
import IconButton, { Button } from '../../../../style/Buttons'
import styled, { useTheme } from 'styled-components'
import { ComboboxItem, ItemCenterWrapper, ItemDesc, ItemTitle } from '../../tag/components/TagCombobox.styles'
import { useComboboxStore } from '../useComboboxStore'
import { PrimaryText } from '../../../../style/Integration'
import { useSearch } from '../../../../hooks/useSearch'
import { mog } from '../../../../utils/lib/helper'
import { groupBy } from 'lodash'
import { useLinks } from '../../../../hooks/useLinks'
import { KEYBOARD_KEYS } from '../../../../components/spotlight/Home/components/List'
import { getContent } from '../../../../utils/helpers'
import { getBlock } from '../../../../utils/search/parseData'

const StyledComboHeader = styled(ComboboxItem)`
  padding: 0.2rem 0;
  margin: 0.25rem 0;

  ${Button} {
    padding: 0.25rem;
    margin: 0 0.5rem 0;
  }
`

const BlockCombo = () => {
  const [blocks, setBlocks] = useState<Array<any>>(undefined)

  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)
  const setActiveBlock = useComboboxStore((store) => store.setActiveBlock)
  const [index, setIndex] = useState<number>(0)

  const { getPathFromNodeid } = useLinks()

  const { textAfterBlockTrigger, textAfterTrigger } = useComboboxStore((store) => store.search)

  const theme = useTheme()
  const { queryIndex } = useSearch()

  useEffect(() => {
    const trimmedSearch = textAfterBlockTrigger?.trim()

    if (trimmedSearch) {
      queryIndex(['node', 'snippet'], trimmedSearch).then((res) => {
        if (textAfterTrigger) {
          const newBlocks = res.map((block) => {
            const { matchField, ...restBlock } = block
            return restBlock
          })
          setBlocks(newBlocks)
          setIndex(0)
        }
        // setBlocks(res)
      })
    } else {
      setBlocks(undefined)
    }
  }, [textAfterBlockTrigger])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === KEYBOARD_KEYS.ArrowDown) {
        event.preventDefault()

        if (blocks) {
          setIndex((index) => {
            const nextIndex = index < blocks.length - 1 ? index + 1 : index
            return nextIndex
          })
        }
      }

      if (event.key === KEYBOARD_KEYS.ArrowUp) {
        event.preventDefault()

        if (blocks) {
          setIndex((index) => {
            const nextIndex = index > 0 ? index - 1 : index
            return nextIndex
          })
        }
      }
    }

    window.addEventListener('keydown', handler)

    return () => window.addEventListener('keydown', handler)
  }, [blocks, index])

  useEffect(() => {
    if (blocks && index <= blocks.length - 1) {
      const block = blocks[index]
      mog('Content of block is', { blocks, index, len: blocks.length - 1 })
      const content = getBlock(block.id, block.blockId)

      setActiveBlock({
        ...block,
        content
      })
    }
  }, [index])

  if (!isBlockTriggered) return null

  return (
    <div style={{ maxHeight: '400px', marginLeft: '0.5rem', width: '100%' }}>
      <StyledComboHeader className="" key="random">
        <IconButton
          size={16}
          shortcut={`Esc`}
          icon={arrowLeftLine}
          onClick={() => setBlocks(undefined)}
          title={'Back to Quick links'}
        />
        <ItemTitle>
          <PrimaryText>{textAfterBlockTrigger}</PrimaryText>
        </ItemTitle>
      </StyledComboHeader>

      {blocks?.length === 0 && (
        <ComboboxItem
          key={`Nothing found`}
          className="highlight"
          // {...comboProps(item, index)}
          // onMouseEnter={() => {
          //   setItemIndex(index)
          // }}
          // onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, block)}
        >
          <ItemCenterWrapper>Hmmm.. sure?</ItemCenterWrapper>
        </ComboboxItem>
      )}

      {blocks?.map((block, i) => (
        <ComboboxItem
          key={`${block.id}-${String(i)}`}
          className={index === i ? 'highlight' : ''}
          // {...comboProps(item, index)}
          // onMouseEnter={() => {
          //   setItemIndex(index)
          // }}
          // onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, block)}
        >
          <MexIcon fontSize={24} icon="ph:squares-four-fill" color={theme.colors.primary} />
          <ItemCenterWrapper>{block.text && <ItemDesc>{block.text}</ItemDesc>}</ItemCenterWrapper>
        </ComboboxItem>
      ))}
    </div>
  )
}

export default BlockCombo

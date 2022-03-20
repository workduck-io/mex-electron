import React, { useEffect, useState } from 'react'
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { MexIcon } from '../../../../style/Layouts'
import IconButton from '../../../../style/Buttons'
import { useTheme } from 'styled-components'
import { ComboboxItem, ItemCenterWrapper, ItemDesc, ItemTitle } from '../../tag/components/TagCombobox.styles'
import { useComboboxStore } from '../useComboboxStore'
import { PrimaryText } from '../../../../style/Integration'
import { useSearch } from '../../../../hooks/useSearch'
import { KEYBOARD_KEYS } from '../../../../components/spotlight/Home/components/List'
import { getBlock } from '../../../../utils/search/parseData'
import { ComboSeperator, StyledComboHeader } from './styled'
import { replaceFragment } from '../hooks/useComboboxOnKeyDown'
import { getPlateEditorRef } from '@udecode/plate'
import { getPathFromNodeIdHookless } from '../../../../hooks/useLinks'
import { mog } from '../../../../utils/lib/helper'
import { ActionTitle } from '../../../../components/spotlight/Actions/styled'

const BlockCombo = ({ nodeId, isNew }: { nodeId?: string; isNew?: boolean }) => {
  const [index, setIndex] = useState<number>(0)
  const [blocks, setBlocks] = useState<Array<any>>(undefined)

  const blockRange = useComboboxStore((store) => store.blockRange)
  const setPreview = useComboboxStore((store) => store.setPreview)
  const setActiveBlock = useComboboxStore((store) => store.setActiveBlock)
  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)
  const { textAfterBlockTrigger, textAfterTrigger } = useComboboxStore((store) => store.search)

  const theme = useTheme()
  const { queryIndexByNodeId, queryIndex } = useSearch()

  const clearBlockSearch = () => {
    if (blockRange && isBlockTriggered) {
      replaceFragment(getPlateEditorRef(), blockRange, '')
    }
    setBlocks(undefined)
  }

  useEffect(() => {
    const trimmedSearch = textAfterBlockTrigger?.trim()
    const trimmedNodeText = textAfterTrigger?.trim()

    if (trimmedSearch) {
      if (nodeId && trimmedNodeText) {
        queryIndexByNodeId(['node'], nodeId, trimmedSearch).then((res) => {
          const newBlocks = res.map((block) => {
            const { matchField, ...restBlock } = block
            return restBlock
          })

          setBlocks(newBlocks)
          setIndex(0)
          // setBlocks(res)
        })
      } else {
        queryIndex(['node'], trimmedSearch).then((res) => {
          const newBlocks = res.map((block) => {
            const { matchField, ...restBlock } = block
            return restBlock
          })
          setBlocks(newBlocks)
          setIndex(0)
        })
      }
    } else {
      setBlocks(undefined)
    }
  }, [textAfterBlockTrigger])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === KEYBOARD_KEYS.Escape) {
        event.preventDefault()
        clearBlockSearch()
      }
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

    if (blocks) window.addEventListener('keydown', handler)
    else window.removeEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [blocks, isBlockTriggered])

  useEffect(() => {
    onClickSetActiveBlock(blocks, index)
    return () => setActiveBlock(undefined)
  }, [index, blocks])

  const onClickSetActiveBlock = (blocks: Array<any>, index: number) => {
    if (blocks && index <= blocks.length - 1) {
      const block = blocks[index]
      const content = getBlock(block.id, block.blockId)
      setActiveBlock({
        ...block,
        content
      })

      if (content) {
        setPreview([content])
      }
    }
  }

  if (!isBlockTriggered) return null

  return (
    <ComboSeperator>
      <StyledComboHeader className="" key="random">
        <IconButton
          size={16}
          shortcut={`Esc`}
          icon={arrowLeftLine}
          onClick={clearBlockSearch}
          title={'Back to Quick links'}
        />
        <ItemTitle>{`In ${textAfterTrigger}`}</ItemTitle>
      </StyledComboHeader>

      {blocks?.length === 0 && (
        <ComboboxItem key={`search-text`} className="highlight">
          <MexIcon fontSize={20} icon="ri:add-circle-line" color={theme.colors.primary} />
          <ItemCenterWrapper>
            <ItemTitle>
              No results:&nbsp;
              <PrimaryText>{textAfterBlockTrigger}</PrimaryText>
            </ItemTitle>
          </ItemCenterWrapper>
        </ComboboxItem>
      )}

      {blocks?.map((block, i) => {
        const lastItem = i > 0 ? blocks[i - 1] : undefined
        return (
          <span key={`${block.blockId}-${String(i)}`}>
            {block.id !== lastItem?.id && !textAfterTrigger && (
              <ActionTitle>{getPathFromNodeIdHookless(block.id)}</ActionTitle>
            )}
            <ComboboxItem
              onMouseEnter={() => setIndex(i)}
              className={index === i ? 'highlight' : ''}
              onClick={() => onClickSetActiveBlock(blocks, index)}
            >
              <MexIcon fontSize={20} icon="ph:squares-four-fill" color={theme.colors.primary} />
              <ItemCenterWrapper>{block.text && <ItemDesc>{block.text}</ItemDesc>}</ItemCenterWrapper>
            </ComboboxItem>
          </span>
        )
      })}
    </ComboSeperator>
  )
}

export default BlockCombo

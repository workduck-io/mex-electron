import React, { useEffect, useState } from 'react'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { getPlateEditorRef } from '@udecode/plate'
import { mog } from '@utils/lib/mog'
import { useTheme } from 'styled-components'

import { DisplayShortcut, IconButton } from '@workduck-io/mex-components'

import { ActionTitle } from '../../../../components/spotlight/Actions/styled'
import { ShortcutText } from '../../../../components/spotlight/Home/components/Item'
import { KEYBOARD_KEYS } from '../../../../components/spotlight/Home/components/List'
import { getPathFromNodeIdHookless } from '../../../../hooks/useLinks'
import { useSearch } from '../../../../hooks/useSearch'
import { PrimaryText } from '../../../../style/Integration'
import { MexIcon } from '../../../../style/Layouts'
import { BlockIcons } from '../../Blocks/BlockIcons'
import { ComboboxItem, ItemCenterWrapper, ItemDesc, ItemTitle } from '../../tag/components/TagCombobox.styles'
import { replaceFragment } from '../hooks/useComboboxOnKeyDown'
import { useComboboxStore } from '../useComboboxStore'
import { ComboboxShortcuts, ComboSeperator, StyledComboHeader } from './styled'

type BlockComboProps = {
  onSelect
  nodeId?: string
  shortcuts: Record<string, any> | undefined
  isNew?: boolean
}

const BlockCombo = ({ nodeId, onSelect, shortcuts }: BlockComboProps) => {
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

    // Only reset blocks when block combo is un-triggered
    // Checking like this removes the case when trimmedSearch is empty string
    if (trimmedSearch !== undefined) {
      if (nodeId) {
        queryIndexByNodeId(['node'], nodeId, trimmedSearch).then((res) => {
          const topFiveBlocks = res
            ?.filter((block) => block.blockId !== 'undefined')
            ?.map((block) => {
              const { matchField, ...restBlock } = block
              return restBlock
            })
            ?.slice(0, 5)

          setBlocks(topFiveBlocks)
          setIndex(0)
          // setBlocks(res)
        })
      } else {
        queryIndex(['node'], trimmedSearch).then((res) => {
          const topFiveBlocks = res
            ?.filter((block) => block.blockId !== 'undefined')
            ?.map((block) => {
              const { matchField, ...restBlock } = block
              return restBlock
            })
            ?.slice(0, 5)

          setBlocks(topFiveBlocks)
          setIndex(0)
        })
      }
    } else {
      setBlocks(undefined)
    }
  }, [textAfterBlockTrigger])

  useEffect(() => {
    const handler = (event) => {
      switch (event.key) {
        case KEYBOARD_KEYS.ArrowDown:
          event.preventDefault()
          if (blocks) {
            setIndex((index) => {
              const nextIndex = index < blocks.length - 1 ? index + 1 : index
              return nextIndex
            })
          }

          break
        case KEYBOARD_KEYS.ArrowUp:
          event.preventDefault()

          if (blocks) {
            setIndex((index) => {
              const nextIndex = index > 0 ? index - 1 : index
              return nextIndex
            })
          }

          break
        case KEYBOARD_KEYS.Escape:
          event.preventDefault()
          clearBlockSearch()
          break
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
      const content = block.data
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
        <ItemTitle>{textAfterTrigger ? `In ${textAfterTrigger}` : `Search`}</ItemTitle>
      </StyledComboHeader>
      {blocks?.length === 0 && (
        <ComboboxItem key={`search-text`} className="highlight">
          <MexIcon fontSize={16} icon="ri:add-circle-line" color={theme.colors.primary} />
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
              onClick={() => {
                onClickSetActiveBlock(blocks, index)
                // if (comboItem.type === QuickLinkType.ilink) {
                onSelect()
                // }
              }}
            >
              <MexIcon fontSize={16} icon={BlockIcons[block?.data?.type]} color={theme.colors.primary} />
              <ItemCenterWrapper>{block.text && <ItemDesc>{block.text}</ItemDesc>}</ItemCenterWrapper>
            </ComboboxItem>
          </span>
        )
      })}
      {shortcuts && blocks?.length !== 0 && textAfterBlockTrigger?.trim() && (
        <ComboboxShortcuts>
          {Object.entries(shortcuts).map(([key, shortcut]) => {
            return (
              <ShortcutText key={key}>
                <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
              </ShortcutText>
            )
          })}
        </ComboboxShortcuts>
      )}
    </ComboSeperator>
  )
}

export default BlockCombo

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

  const { getPathFromNodeid } = useLinks()

  const { textAfterBlockTrigger, textAfterTrigger } = useComboboxStore((store) => store.search)

  const theme = useTheme()
  const { queryIndex } = useSearch()

  useEffect(() => {
    const trimmedSearch = textAfterBlockTrigger?.trim()
    if (trimmedSearch) {
      queryIndex(['node', 'snippet'], trimmedSearch).then((res) => {
        if (textAfterTrigger) {
          const grouped = groupBy(res, 'id')

          mog(
            'Grouped',
            { trimmedSearch, grouped, nodes: Object.keys(grouped).map((nodeid) => getPathFromNodeid(nodeid)) },
            { pretty: true, collapsed: false }
          )
        }
        // setBlocks(res)
      })
    } else {
      setBlocks(undefined)
    }
  }, [textAfterBlockTrigger])

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

      {blocks?.map((block, index) => (
        <ComboboxItem
          key={`${block.id}-${String(index)}`}
          // className={index === itemIndex ? 'highlight' : ''}
          // {...comboProps(item, index)}
          // onMouseEnter={() => {
          //   setItemIndex(index)
          // }}
          // onMouseDown={editor && getPreventDefaultHandler(onSelectItem, editor, block)}
        >
          <MexIcon fontSize={24} icon="ph:squares-four-fill" color={theme.colors.primary} />
          <ItemCenterWrapper>
            {/* <ItemTitle>{block.type}</ItemTitle> */}
            {block.text && <ItemDesc>{block.text}</ItemDesc>}
          </ItemCenterWrapper>
        </ComboboxItem>
      ))}
    </div>
  )
}

export default BlockCombo

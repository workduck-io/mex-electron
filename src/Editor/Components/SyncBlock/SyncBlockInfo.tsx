import React from 'react'
import messageIcon from '@iconify-icons/ri/message-3-line'
import { GraphTools, StyledSyncBlockInfo } from '../../../Components/Graph/Graph.styles'
import IconButton from '../../../Styled/Buttons'
import useToggleElements from '../../../Hooks/useToggleElements/useToggleElements'
import { useFilteredContent } from '../../../Lib/filter'
import styled, { css } from 'styled-components'
import { ELEMENT_SYNC_BLOCK, SyncBlock } from '.'
import { EditorStyles } from '../../../Styled/Editor'
import { useSyncStore } from '../../../Editor/Store/SyncStore'
import { NodeEditorContent } from '../../../Editor/Store/Types'

const StyledBlockInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
`

const MarginVertical = styled.div<{ selected: boolean }>`
  ${({ selected }) =>
    selected &&
    css`
      margin-bottom: 5.5rem;
    `}
`

const SyncBlockInfo = () => {
  const { showSyncBlocks, toggleSyncBlocks } = useToggleElements()
  const selectedBlockId = useSyncStore((state) => state.selectedSyncBlock)

  const { elements: syncBlocks } = useFilteredContent({ type: ELEMENT_SYNC_BLOCK })

  return (
    <StyledSyncBlockInfo>
      <GraphTools>
        <IconButton size={24} icon={messageIcon} title="Graph" highlight={showSyncBlocks} onClick={toggleSyncBlocks} />
      </GraphTools>
      <StyledBlockInfo>
        <EditorStyles>
          {syncBlocks.map((syncBlock: any) => (
            <MarginVertical key={syncBlock.id} selected={syncBlock.id === selectedBlockId}>
              <SyncBlock
                info
                attributes={{ 'data-slate-inline': true, 'data-slate-node': 'element', ref: null }}
                element={syncBlock}
              >
                {''}
              </SyncBlock>
            </MarginVertical>
          ))}
        </EditorStyles>
      </StyledBlockInfo>
    </StyledSyncBlockInfo>
  )
}

export default SyncBlockInfo

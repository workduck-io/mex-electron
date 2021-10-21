import React from 'react'
import messageIcon from '@iconify-icons/ri/message-3-line'
import { GraphTools, StyledGraph } from '../../../Components/Graph/Graph.styles'
import IconButton from '../../../Styled/Buttons'
import useToggleElements from '../../../Hooks/useToggleElements/useToggleElements'
import { useFilteredContent } from '../../../Lib/filter'
import styled from 'styled-components'
import { SyncBlock } from '.'

const StyledBlockInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
`

const SyncBlockInfo = () => {
  const { showSyncBlocks, toggleSyncBlocks } = useToggleElements()
  const { syncBlocks } = useFilteredContent()

  return (
    <StyledGraph>
      <GraphTools>
        <IconButton size={24} icon={messageIcon} title="Graph" highlight={showSyncBlocks} onClick={toggleSyncBlocks} />
      </GraphTools>
      <StyledBlockInfo>
        {syncBlocks.map((syncBlockId: string) => (
          <SyncBlock
            info
            attributes={{ 'data-slate-inline': true, 'data-slate-node': 'element', ref: null }}
            element={{ id: syncBlockId, children: [{ text: '' }], type: 'sync_block' }}
          >
            {''}
          </SyncBlock>
        ))}
      </StyledBlockInfo>
    </StyledGraph>
  )
}

export default SyncBlockInfo

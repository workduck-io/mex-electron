import messageIcon from '@iconify/icons-ri/message-3-line'
import more2Fill from '@iconify/icons-ri/more-2-fill'
import React from 'react'
import styled, { css } from 'styled-components'
import { ELEMENT_SYNC_BLOCK, SyncBlock } from '.'
import { GraphTools, StyledSyncBlockInfo } from '../../../components/mex/Graph/Graph.styles'
import useToggleElements from '../../../hooks/useToggleElements'
import { useHelpStore } from '../../../store/useHelpStore'
import { useSyncStore } from '../../../store/useSyncStore'
import IconButton from '../../../style/Buttons'
import { EditorStyles } from '../../../style/Editor'
import { useFilteredContent } from '../../../utils/lib/filter'

export const StyledBlockInfo = styled.div`
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
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const selectedBlockId = useSyncStore((state) => state.selectedSyncBlock)

  const { elements: syncBlocks } = useFilteredContent({ type: ELEMENT_SYNC_BLOCK })

  return (
    <StyledSyncBlockInfo>
      <GraphTools>
        <IconButton
          size={24}
          icon={messageIcon}
          shortcut={shortcuts.showSyncBlocks.keystrokes}
          title="Flow Links"
          highlight={showSyncBlocks}
          onClick={toggleSyncBlocks}
        />
        <label htmlFor="flow-links">Flow Links</label>
        <IconButton size={24} icon={more2Fill} title="Options" />
      </GraphTools>
      <StyledBlockInfo>
        <EditorStyles>
          {syncBlocks.map((syncBlock: any) => (
            <MarginVertical key={syncBlock.id} selected={syncBlock.id === selectedBlockId}>
              <SyncBlock
                editor={null as any}
                plugins={[]}
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

import messageIcon from '@iconify/icons-ri/message-3-line'
import more2Fill from '@iconify/icons-ri/more-2-fill'
import React from 'react'
import styled, { css } from 'styled-components'
import { ELEMENT_SYNC_BLOCK, SyncBlock } from '.'
import { StyledSyncBlockInfo } from '../../../components/mex/Graph/Graph.styles'
import useToggleElements from '../../../hooks/useToggleElements'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { useSyncStore } from '../../../store/useSyncStore'
import IconButton from '../../../style/Buttons'
import { EditorStyles } from '../../../style/Editor'
import { InfobarTools } from '../../../style/infobar'
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
  const infobar = useLayoutStore((state) => state.infobar)
  const { toggleSyncBlocks } = useToggleElements()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const selectedBlockId = useSyncStore((state) => state.selectedSyncBlock)

  const { elements: syncBlocks } = useFilteredContent({ type: ELEMENT_SYNC_BLOCK })

  return (
    <StyledSyncBlockInfo>
      <InfobarTools>
        <IconButton
          size={24}
          icon={messageIcon}
          shortcut={shortcuts.showSyncBlocks.keystrokes}
          title="Flow Links"
          highlight={infobar.mode === 'flow'}
          onClick={toggleSyncBlocks}
        />
        <label htmlFor="flow-links">Flow Links</label>
        <IconButton size={24} icon={more2Fill} title="Options" />
      </InfobarTools>
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

import React from 'react'
import styled from 'styled-components'
import useBlockStore, { ContextMenuActionType } from '../../../store/useBlockStore'
import { Button } from '../../../style/Buttons'
import { ButtonWrapper } from '../../../style/Settings'

const BlockMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.large};
`

const BlockInfoBar = () => {
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const blocks = useBlockStore((store) => store.blocks)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  const length = Object.values(blocks).length
  const blockHeading = length === 0 ? 'Select Blocks' : `${length} block${length > 1 ? 's' : ''} selected`

  return (
    <BlockMenu>
      <Button onClick={() => setIsBlockMode(!isBlockMode)}>Cancel</Button>
      <p>{blockHeading}</p>
      <ButtonWrapper>
        <Button onClick={() => setIsModalOpen(ContextMenuActionType.send)}>Send to</Button>
        <Button onClick={() => setIsModalOpen(ContextMenuActionType.move)}>Move to</Button>
      </ButtonWrapper>
    </BlockMenu>
  )
}

export default BlockInfoBar

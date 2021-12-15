import React, { useEffect } from 'react'
import { WrappedNodeSelect } from '../../Components/NodeSelect/NodeSelect'
import { useLinks } from '../Actions/useLinks'
import { useEditorStore } from '../Store/EditorStore'
import { useRenameStore } from '../../Components/Refactor/Rename'
import { useRefactor } from '../Actions/useRefactor'
import styled from 'styled-components'
import { Button } from '../../Styled/Buttons'
import { Input } from '../../Styled/Form'

const Wrapper = styled.div`
  position: relative;

  ${Input} {
    border: 1px solid transparent;
    &:hover,
    &:focus,
    &:active {
      border: 1px solid ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.gray[8]};
    }
  }
`

const ButtonWrapper = styled.div`
  position: absolute;
  top: 100%;
  display: flex;

  ${Button} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

const NodeRenameTitle = () => {
  const { getUidFromNodeId } = useLinks()
  const { execRefactor, getMockRefactor } = useRefactor()

  // const open = useRenameStore((store) => store.open)
  // const focus = useRenameStore((store) => store.focus)
  const to = useRenameStore((store) => store.to)
  // const from = useRenameStore((store) => store.from)
  const mockRefactored = useRenameStore((store) => store.mockRefactored)

  const openModal = useRenameStore((store) => store.openModal)
  // const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const setTo = useRenameStore((store) => store.setTo)
  // const setFrom = useRenameStore((store) => store.setFrom)

  const handleToChange = (newValue: string) => {
    if (newValue) {
      setTo(newValue)
    }
  }

  const handleToCreate = (inputValue: string) => {
    if (inputValue) {
      setTo(inputValue)
    }
  }

  useEffect(() => {
    if (to) {
      setMockRefactored(getMockRefactor(useEditorStore.getState().node.id, to))
    }
  }, [to])

  return (
    <Wrapper>
      <WrappedNodeSelect
        id="titleLookup"
        name="titleLookup"
        prefillLast
        defaultValue={useEditorStore.getState().node.id}
        handleSelectItem={handleToChange}
        handleCreateItem={handleToCreate}
      />
      <ButtonWrapper>
        <Button>Rename</Button>
        <Button>Cancel</Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

export default NodeRenameTitle

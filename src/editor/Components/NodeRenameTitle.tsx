import Tippy from '@tippyjs/react'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { WrappedNodeSelect } from '../../components/mex/NodeSelect/NodeSelect'
import { StyledInputWrapper } from '../../components/mex/NodeSelect/NodeSelect.styles'
import { doesLinkRemain } from '../../components/mex/Refactor/doesLinkRemain'
import { useLinks } from '../../hooks/useLinks'
import { useNavigation } from '../../hooks/useNavigation'
import { useRefactor } from '../../hooks/useRefactor'
import { useEditorStore } from '../../store/useEditorStore'
import { useRenameStore } from '../../store/useRenameStore'
import { Button } from '../../style/Buttons'
import { Input } from '../../style/Form'

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  ${StyledInputWrapper} {
    margin: 0;
  }

  .smallTooltip {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  ${Input} {
    width: 100%;
    margin-right: ${({ theme }) => theme.spacing.small};
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
  padding: ${({ theme }) => theme.spacing.medium} 0;
  z-index: 200;

  ${Button} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

const TitleStatic = styled.div`
  border: 1px solid transparent;
  padding: ${({ theme }) => theme.spacing.small} 8px;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-right: ${({ theme }) => theme.spacing.small};

  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.colors.gray[8]};
  }
`

// export const TippyTheme = css`

// .tippy-box[data-theme~='mex'] {
//   background-color: ${({ theme }) => theme.colors.gray[7]}
//   font-weight: 600;

//   &[data-placement^='top'] > .tippy-arrow::before {
//     border-top-color: ${({ theme }) => theme.colors.gray[7]};
//   }

//   &[data-placement^='bottom'] > .tippy-arrow::before {
//     border-bottom-color: ${({ theme }) => theme.colors.gray[7]};
//   }

//   &[data-placement^='left'] > .tippy-arrow::before {
//     border-left-color: ${({ theme }) => theme.colors.gray[7]};
//   }

//   &[data-placement^='right'] > .tippy-arrow::before {
//     border-right-color: ${({ theme }) => theme.colors.gray[7]};
//   }

//   > .tippy-backdrop {
//     background-color: ${({ theme }) => theme.colors.gray[7]};
//   }

//   > .tippy-svg-arrow {
//     fill: ${({ theme }) => theme.colors.gray[7]};
//   }
// }
// `

const NodeRenameTitle = () => {
  const { getUidFromNodeId } = useLinks()
  const { execRefactor, getMockRefactor } = useRefactor()

  // const focus = useRenameStore((store) => store.focus)
  const to = useRenameStore((store) => store.to)
  // const from = useRenameStore((store) => store.from)
  const mockRefactored = useRenameStore((store) => store.mockRefactored)

  const { push } = useNavigation()
  const openModal = useRenameStore((store) => store.openModal)
  // const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const modalReset = useRenameStore((store) => store.closeModal)
  const setTo = useRenameStore((store) => store.setTo)
  const nodeFrom = useEditorStore((store) => store.node.id)
  const setFrom = useRenameStore((store) => store.setFrom)
  const [editable, setEditable] = useState(false)
  // const inpRef = useRef<HTMLInputElement>()
  //

  const reset = () => {
    modalReset()
    setEditable(false)
  }

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

  const onRename: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    // console.log('renaming', {})
    if (mockRefactored.length > 1) {
      setFrom(nodeFrom)
      openModal()
      setEditable(false)
      return
    }
    if (to && nodeFrom) {
      const res = execRefactor(nodeFrom, to)

      const path = useEditorStore.getState().node.id
      const nodeid = useEditorStore.getState().node.nodeid
      setEditable(false)
      if (doesLinkRemain(path, res)) {
        push(nodeid)
      } else if (res.length > 0) {
        const nodeid = getUidFromNodeId(res[0].to)
        push(nodeid)
      }
    }
  }

  const onCancel: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    reset()
  }

  useEffect(() => {
    if (to) {
      setMockRefactored(getMockRefactor(useEditorStore.getState().node.id, to))
    }
  }, [to, nodeFrom])

  useEffect(() => {
    reset()
  }, [nodeFrom])

  // console.log({ mockRefactored, to, nodeFrom, editable })

  return (
    <Wrapper>
      {editable ? (
        <WrappedNodeSelect
          id="NodeRenameTitleSelect"
          name="NodeRenameTitleSelect"
          createAtTop
          disallowReserved
          autoFocus
          defaultValue={to ?? nodeFrom}
          handleSelectItem={handleToChange}
          handleCreateItem={handleToCreate}
        />
      ) : (
        <Tippy theme="mex" placement="bottom-start" content="Click to Rename">
          <TitleStatic
            onClick={(e) => {
              e.preventDefault()
              setEditable(true)
            }}
          >
            {nodeFrom}
          </TitleStatic>
        </Tippy>
      )}
      {editable && (
        <ButtonWrapper>
          <Button primary key="ButtonRename" onClick={onRename}>
            Rename
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </ButtonWrapper>
      )}
    </Wrapper>
  )
}

export default NodeRenameTitle

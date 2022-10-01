import React, { useEffect, useMemo, useState } from 'react'

import Tippy from '@tippyjs/react'
import { mog } from '@utils/lib/mog'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { QuickLink, WrappedNodeSelect } from '../../../components/mex/NodeSelect/NodeSelect'
import { StyledInputWrapper } from '../../../components/mex/NodeSelect/NodeSelect.styles'
import { doesLinkRemain } from '../../../components/mex/Refactor/doesLinkRemain'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { useAnalysisStore } from '../../../store/useAnalysis'
import { useEditorStore } from '../../../store/useEditorStore'
import { useRenameStore } from '../../../store/useRenameStore'
import { Input } from '../../../style/Form'
import { isMatch, isReserved } from '../../../utils/lib/paths'

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

const NodeRenameTitle = () => {
  const { getNodeidFromPath, updateILinks } = useLinks()
  const { execRefactorAsync, getMockRefactor } = useRefactor()

  // const focus = useRenameStore((store) => store.focus)
  const to = useRenameStore((store) => store.to)
  const toNS = useRenameStore((store) => store.toNS)
  // const from = useRenameStore((store) => store.from)
  const mockRefactored = useRenameStore((store) => store.mockRefactored)
  const nodeTitle = useAnalysisStore((state) => state.analysis.title)

  const { push } = useNavigation()
  const openModal = useRenameStore((store) => store.openModal)
  // const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const modalReset = useRenameStore((store) => store.closeModal)
  const setTo = useRenameStore((store) => store.setTo)
  const editorNode = useEditorStore((store) => store.node)
  // const nodeFrom = useEditorStore((store) => store.node.id ?? '')
  const { namespace: nodeFromNS } = useEditorStore((store) => store.node)
  const setFrom = useRenameStore((store) => store.setFrom)
  const [editable, setEditable] = useState(false)
  // const inpRef = useRef<HTMLInputElement>()
  //
  const nodeFrom = useMemo(
    () => ({
      path: editorNode.path,
      namespaceID: editorNode.namespace
    }),
    [editorNode]
  )

  useEffect(() => {
    if (nodeFrom && isReserved(nodeFrom.path)) {
      mog('ISRESERVED', { nodeFrom })
    }
  }, [nodeFrom])
  const reset = () => {
    if (editable) modalReset()
    setEditable(false)
  }

  const handleToChange = (newValue: QuickLink) => {
    if (newValue.value) {
      setTo({ path: newValue.value, namespaceID: newValue.namespace })
    }
  }

  const handleToCreate = (inputValue: QuickLink) => {
    if (inputValue.value) {
      setTo({ path: inputValue.value, namespaceID: inputValue.namespace })
    }
  }

  const onRename: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    // console.log('renaming', {})
    if (mockRefactored.length > 1) {
      setFrom(nodeFrom)
      openModal()
      setEditable(false)
      return
    }
    if (to && nodeFrom) {
      const refactored = await execRefactorAsync(nodeFrom, { path: to, namespaceID: nodeFromNS })

      const nodeid = useEditorStore.getState().node.nodeid
      setEditable(false)

      if (doesLinkRemain(nodeid, refactored)) {
        push(nodeid)
      } else if (refactored.length > 0) {
        const nodeid = refactored[0].nodeid
        push(nodeid)
      }
    }
  }

  const onCancel: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    reset()
  }

  useEffect(() => {
    if (to && editable) {
      mog('RenameInput', { id: useEditorStore.getState().node.id, to })
      setMockRefactored(getMockRefactor(useEditorStore.getState().node.id, to))
    }
  }, [to, nodeFrom, editable])

  useEffect(() => {
    reset()
  }, [nodeFrom])

  // console.log({ mockRefactored, to, nodeFrom, editable })

  return (
    <Wrapper>
      {isReserved(nodeFrom.path) ? (
        <Tippy theme="mex" placement="bottom-start" content="Reserved Node">
          <TitleStatic>{nodeTitle?.length > 0 ? nodeTitle : nodeFrom.path}</TitleStatic>
        </Tippy>
      ) : editable ? (
        <WrappedNodeSelect
          id="NodeRenameTitleSelect"
          name="NodeRenameTitleSelect"
          createAtTop
          disallowReserved
          disallowMatch={(path) => isMatch(path, nodeFrom.path)}
          disallowClash
          autoFocus
          defaultValue={to ? { path: to, namespace: toNS } : { path: nodeFrom.path, namespace: nodeFrom.namespaceID }}
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
            {nodeTitle?.length > 0 ? nodeTitle : nodeFrom.path}
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

import arrowRightLine from '@iconify-icons/ri/arrow-right-line'
import { Icon } from '@iconify/react'
import { rgba } from 'polished'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { ActionMeta } from 'react-select'
import { css } from 'styled-components'
import tinykeys from 'tinykeys'
import { useRefactor } from '../../Editor/Actions/useRefactor'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import { NodeLink } from '../../Types/relations'
import LookupInput from '../NodeInput/NodeSelect'
import { Value } from '../NodeInput/Types'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

export const RefactorStyles = css`
  .RefactorContent {
    /* position: absolute; */
    width: max-content;
    height: max-content;
    margin: auto;
    background: ${({ theme }) => theme.colors.background.card};
    box-shadow: 0px 20px 100px ${({ theme }) => theme.colors.gray[9]};
    overflow: visible;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    outline: none;
    padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
    min-height: 240px;
    min-width: 400px;
  }
  .RefactorOverlay {
    position: fixed;
    inset: 0px;
    display: flex;
    background-color: ${({ theme }) => rgba(theme.colors.palette.black, 0.5)};
  }
`

interface RenameState {
  open: boolean
  from: string
  to: string
  defFrom: { label: string; value: string }
  mockRefactor: NodeLink[]
}

const Rename = () => {
  const { execRefactor, getMockRefactor } = useRefactor()
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)

  const [renameState, setRenameState] = useState<RenameState>({
    open: false,
    from: '',
    to: '',
    defFrom: {
      label: '',
      value: ''
    },
    mockRefactor: []
  })

  const openModal = () => {
    const nodeId = useEditorStore.getState().node.id
    setRenameState((state) => ({
      ...state,
      open: true,
      from: nodeId,
      defFrom: {
        value: nodeId,
        label: nodeId
      }
    }))
  }

  const closeModal = () => {
    setRenameState({
      open: false,
      from: '',
      defFrom: {
        value: '',
        label: ''
      },
      to: '',
      mockRefactor: []
    })
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyN': (event) => {
        event.preventDefault()
        openModal()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  // console.log({ to, from, open });

  const handleFromChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue
      setRenameState({
        ...renameState,
        from: value
      })
    }
  }

  const handleToChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue
      setRenameState((state) => ({
        ...state,
        to: value
      }))
    }
  }

  const handleToCreate = (inputValue: string) => {
    if (inputValue) {
      setRenameState((state) => ({
        ...state,
        to: inputValue
      }))
    }
  }

  // console.log({ mockRefactored });

  const { from, to, defFrom, open, mockRefactor } = renameState

  useEffect(() => {
    // console.log({ to, from });
    if (to && from) {
      setRenameState((state) => ({
        ...state,
        mockRefactor: getMockRefactor(from, to)
      }))
    }
  }, [to, from])

  const handleRefactor = () => {
    if (to && from) {
      const res = execRefactor(from, to)
      console.log(res)

      const nodeId = useEditorStore.getState().node.id
      if (doesLinkRemain(nodeId, res)) {
        loadNodeFromId(nodeId)
      } else if (res.length > 0) {
        loadNodeFromId(res[0].to)
      }
    }

    closeModal()
  }

  return (
    <Modal className="RefactorContent" overlayClassName="RefactorOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Rename</ModalHeader>

      <LookupInput placeholder="Rename node from..." defaultValue={defFrom} handleChange={handleFromChange} />

      <LookupInput
        placeholder="Rename node to..."
        autoFocus
        menuOpen
        handleChange={handleToChange}
        handleCreate={handleToCreate}
      />

      {mockRefactor.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Nodes being refactored... </h1>
          </MRMHead>
          {mockRefactor.map((t) => (
            <MRMRow key={`MyKeys_${t.from}`}>
              <p>{t.from}</p>
              <ArrowIcon>
                <Icon icon={arrowRightLine}> </Icon>
              </ArrowIcon>
              <p>{t.to}</p>
            </MRMRow>
          ))}
        </MockRefactorMap>
      )}

      <ModalControls>
        <Button primary size="large" onClick={handleRefactor}>
          Apply Rename
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Rename

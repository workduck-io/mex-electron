import arrowRightLine from '@iconify-icons/ri/arrow-right-line'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { ActionMeta } from 'react-select'
import tinykeys from 'tinykeys'
import { useRefactor } from '../../Editor/Actions/useRefactor'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import { NodeLink } from '../../Types/relations'
import LookupInput from '../NodeInput/NodeSelect'
import { Value } from '../NodeInput/Types'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

interface RefactorState {
  open: boolean
  mockRefactored: NodeLink[]
  from: string | undefined
  to: string | undefined
}

const Refactor = () => {
  const [refactorState, setRefactoredState] = useState<RefactorState>({
    from: undefined,
    to: undefined,
    mockRefactored: [],
    open: false
  })

  const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)

  const openModal = () => {
    setRefactoredState((state) => ({
      ...state,
      open: true
    }))
  }

  const closeModal = () => {
    setRefactoredState({
      from: undefined,
      to: undefined,
      mockRefactored: [],
      open: false
    })
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyR': (event) => {
        event.preventDefault()
        openModal()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  const handleFromChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue

      setRefactoredState((state) => ({
        ...state,
        from: value
      }))
    }
  }

  const handleToChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue
      setRefactoredState((state) => ({
        ...state,
        to: value
      }))
    }
  }

  const handleToCreate = (inputValue: string) => {
    if (inputValue) {
      setRefactoredState((state) => ({
        ...state,
        to: inputValue
      }))
    }
  }

  const { getMockRefactor, execRefactor } = useRefactor()

  const { from, to, mockRefactored, open } = refactorState

  useEffect(() => {
    // console.log({ to, from });
    if (to && from) {
      setRefactoredState((state) => ({
        ...state,
        mockRefactored: getMockRefactor(from, to)
      }))
    }
  }, [to, from])

  // console.log({ mockRefactored });

  const handleRefactor = () => {
    const res = execRefactor(from, to)
    const nodeId = useEditorStore.getState().node.id
    if (doesLinkRemain(nodeId, res)) {
      loadNodeFromId(nodeId)
    } else if (res.length > 0) {
      loadNodeFromId(res[0].to)
    }
    closeModal()
  }

  return (
    <Modal className="RefactorContent" overlayClassName="RefactorOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Refactor</ModalHeader>

      <LookupInput placeholder="Refactor From Node..." menuOpen autoFocus handleChange={handleFromChange} />

      <LookupInput placeholder="Refactor To Node..." handleChange={handleToChange} handleCreate={handleToCreate} />

      {mockRefactored.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Nodes being refactored... </h1>
            <p>{mockRefactored.length} changes</p>
          </MRMHead>
          {mockRefactored.map((t) => (
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
          Apply Refactor
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Refactor

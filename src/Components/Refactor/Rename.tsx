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
import { useHelpStore } from '../Help/HelpModal'
import LookupInput from '../NodeInput/NodeSelect'
import { Value } from '../NodeInput/Types'
import NodeSelect from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

interface RenameState {
  open: boolean
  from: string
  to: string
  mockRefactor: NodeLink[]
}

const Rename = () => {
  const { execRefactor, getMockRefactor } = useRefactor()
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const [renameState, setRenameState] = useState<RenameState>({
    open: false,
    from: '',
    to: '',
    mockRefactor: []
  })

  const openModal = () => {
    const nodeId = useEditorStore.getState().node.id
    setRenameState((state) => ({
      ...state,
      open: true,
      from: nodeId
    }))
  }

  const closeModal = () => {
    setRenameState({
      open: false,
      from: '',
      to: '',
      mockRefactor: []
    })
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRename.keystrokes]: (event) => {
        event.preventDefault()
        openModal()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  // console.log({ to, from, open });

  const handleFromChange = (newValue: string) => {
    if (newValue) {
      setRenameState({
        ...renameState,
        from: newValue
      })
    }
  }

  const handleToChange = (newValue: string) => {
    if (newValue) {
      setRenameState((state) => ({
        ...state,
        to: newValue
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

  const { from, to, open, mockRefactor } = renameState

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
      // console.log(res)

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
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Rename</ModalHeader>

      <NodeSelect
        placeholder="Rename node from..."
        defaultValue={useEditorStore.getState().node.id}
        highlightWhenSelected
        iconHighlight={from !== ''}
        handleSelectItem={handleFromChange}
      />

      <NodeSelect
        placeholder="Rename node to..."
        autoFocus
        menuOpen
        highlightWhenSelected
        iconHighlight={to !== ''}
        handleSelectItem={handleToChange}
        handleCreateItem={handleToCreate}
      />

      {mockRefactor.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Nodes being refactored... </h1>
            <p>{mockRefactor.length} changes</p>
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

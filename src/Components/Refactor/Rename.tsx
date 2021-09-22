import arrowRightLine from '@iconify-icons/ri/arrow-right-line'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import tinykeys from 'tinykeys'
import { useRefactor } from '../../Editor/Actions/useRefactor'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import { NodeLink } from '../../Types/relations'
import { useHelpStore } from '../Help/HelpModal'
import { WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'
import create from 'zustand'

interface RenameStoreState {
  open: boolean
  focus: boolean
  mockRefactored: NodeLink[]
  from: string | undefined
  to: string | undefined
  openModal: (id?: string) => void
  closeModal: () => void
  setMockRefactored: (mR: NodeLink[]) => void
  setFocus: (focus: boolean) => void
  setFrom: (from: string) => void
  setTo: (from: string) => void
  prefillModal: (from: string, to: string) => void
}

export const useRenameStore = create<RenameStoreState>((set) => ({
  open: false,
  mockRefactored: [],
  from: undefined,
  to: undefined,
  focus: true,
  openModal: (id) => {
    if (id) {
      set({ open: true, from: id })
    } else {
      set({
        open: true
      })
    }
  },
  closeModal: () => {
    set({
      from: undefined,
      to: undefined,
      mockRefactored: [],
      open: false
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  setMockRefactored: (mockRefactored: NodeLink[]) => {
    set({ mockRefactored })
  },
  setFrom: (from: string) => set({ from }),
  setTo: (to: string) => set({ to }),
  prefillModal: (from: string, to: string) =>
    set({
      from,
      to,
      open: true,
      focus: false
    })
}))

const Rename = () => {
  const { execRefactor, getMockRefactor } = useRefactor()
  const { push } = useNavigation()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const open = useRenameStore((store) => store.open)
  const focus = useRenameStore((store) => store.focus)
  const to = useRenameStore((store) => store.to)
  const from = useRenameStore((store) => store.from)
  const mockRefactored = useRenameStore((store) => store.mockRefactored)

  const openModal = useRenameStore((store) => store.openModal)
  const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const setTo = useRenameStore((store) => store.setTo)
  const setFrom = useRenameStore((store) => store.setFrom)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRename.keystrokes]: (event) => {
        event.preventDefault()
        openModal(useEditorStore.getState().node.id)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  const handleFromChange = (newValue: string) => {
    if (newValue) {
      setFrom(newValue)
    }
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

  // const { from, to, open, mockRefactor } = renameState

  useEffect(() => {
    if (to && from) {
      setMockRefactored(getMockRefactor(from, to))
    }
  }, [to, from])

  const handleRefactor = () => {
    if (to && from) {
      const res = execRefactor(from, to)

      const nodeId = useEditorStore.getState().node.id
      if (doesLinkRemain(nodeId, res)) {
        push(nodeId)
      } else if (res.length > 0) {
        push(res[0].to)
      }
    }

    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Rename</ModalHeader>

      <WrappedNodeSelect
        placeholder="Rename node from..."
        defaultValue={from ?? useEditorStore.getState().node.id}
        highlightWhenSelected
        iconHighlight={from !== undefined}
        handleSelectItem={handleFromChange}
      />

      <WrappedNodeSelect
        placeholder="Rename node to..."
        autoFocus
        menuOpen
        highlightWhenSelected
        iconHighlight={to !== undefined}
        handleSelectItem={handleToChange}
        handleCreateItem={handleToCreate}
      />

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
          Apply Rename
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Rename

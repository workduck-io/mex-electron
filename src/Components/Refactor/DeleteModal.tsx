import deleteBin2Line from '@iconify-icons/ri/delete-bin-2-line'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import tinykeys from 'tinykeys'
import { useDelete } from '../../Editor/Actions/useDelete'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import { useHelpStore } from '../Help/HelpModal'
import { WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { DeleteIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'
import create from 'zustand'

interface DeleteState {
  open: boolean
  del: string
  mockData: string[]
}

interface DeleteStoreState {
  open: boolean
  focus: boolean
  mockRefactored: string[]
  del: string | undefined
  openModal: (id?: string) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  setDel: (del: string) => void
  setMockRefactored: (mr: string[]) => void
  setDelAndRefactored: (del: string, mR: string[]) => void
}

export const useDeleteStore = create<DeleteStoreState>((set) => ({
  open: false,
  mockRefactored: [],
  del: undefined,
  focus: true,
  openModal: (id) => {
    if (id) {
      set({ open: true, del: id })
    } else {
      set({
        open: true
      })
    }
  },
  closeModal: () => {
    set({
      del: undefined,
      mockRefactored: [],
      open: false
    })
  },
  setFocus: (focus) => set({ focus }),
  setDel: (del) => set({ del }),
  setMockRefactored: (mockRefactored) => set({ mockRefactored }),
  setDelAndRefactored: (del, mockRefactored) => set({ del, mockRefactored })
}))

const Delete = () => {
  const { getMockDelete, execDelete } = useDelete()
  const { push } = useNavigation()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const openModal = useDeleteStore((store) => store.openModal)
  const closeModal = useDeleteStore((store) => store.closeModal)
  const setDel = useDeleteStore((store) => store.setDel)
  const setMockRefactored = useDeleteStore((store) => store.setMockRefactored)

  const del = useDeleteStore((store) => store.del)
  const open = useDeleteStore((store) => store.open)
  const mockRefactored = useDeleteStore((store) => store.mockRefactored)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showDelete.keystrokes]: (event) => {
        event.preventDefault()
        openModal(useEditorStore.getState().node.id)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  // console.log({ to, from, open });

  const handleDeleteChange = (newValue: string) => {
    if (newValue) {
      setDel(newValue)
    }
  }

  // const { del, mockData, open } = deleteState
  useEffect(() => {
    if (del) {
      setMockRefactored(getMockDelete(del))
    }
  }, [del])

  const handleDelete = () => {
    const { newLinks } = execDelete(del)
    if (newLinks.length > 0) push(newLinks[0].text)
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Delete</ModalHeader>

      <WrappedNodeSelect
        autoFocus
        // menuOpen
        defaultValue={del ?? useEditorStore.getState().node.id}
        handleSelectItem={handleDeleteChange}
      />

      {mockRefactored.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Please confirm deleting the node(s):</h1>
            <p>{mockRefactored.length} changes</p>
          </MRMHead>
          {mockRefactored.map((d) => (
            <MRMRow key={`DelNodeModal_${d}`}>
              <DeleteIcon>
                <Icon icon={deleteBin2Line}></Icon>
              </DeleteIcon>
              <p>{d}</p>
            </MRMRow>
          ))}
        </MockRefactorMap>
      )}
      <ModalControls>
        <Button size="large" primary onClick={handleDelete}>
          Delete
        </Button>
        <Button size="large" onClick={handleCancel}>
          Cancel Culture
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Delete

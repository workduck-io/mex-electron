import deleteBin2Line from '@iconify-icons/ri/delete-bin-2-line'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import tinykeys from 'tinykeys'
import create from 'zustand'
import { useDelete } from '../../Editor/Actions/useDelete'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import { Button } from '../../Styled/Buttons'
import { useHelpStore } from '../Help/HelpModal'
import { WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { DeleteIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

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

  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showDelete.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) openModal(useEditorStore.getState().node.id)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled])

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
    if (newLinks.length > 0) push(newLinks[0].uid)
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
        <Button large primary onClick={handleDelete}>
          Delete
        </Button>
        <Button large onClick={handleCancel}>
          Cancel Culture
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Delete

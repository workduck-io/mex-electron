import archiveLine from '@iconify/icons-ri/archive-line'
import { Icon } from '@iconify/react'
import { Button, DisplayShortcut } from '@workduck-io/mex-components'
import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { useLocation } from 'react-router-dom'
import tinykeys from 'tinykeys'
import create from 'zustand'
import { useDelete } from '../../../hooks/useDelete'
import { useEditorBuffer } from '../../../hooks/useEditorBuffer'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { isReserved } from '../../../utils/lib/paths'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
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
  const { getMockArchive, execArchive } = useDelete()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const location = useLocation()
  const { goTo } = useRouting()

  const openModal = useDeleteStore((store) => store.openModal)
  const closeModal = useDeleteStore((store) => store.closeModal)
  const setDel = useDeleteStore((store) => store.setDel)
  const setMockRefactored = useDeleteStore((store) => store.setMockRefactored)

  const del = useDeleteStore((store) => store.del)
  const open = useDeleteStore((store) => store.open)
  const mockRefactored = useDeleteStore((store) => store.mockRefactored)

  const { saveAndClearBuffer } = useEditorBuffer()
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showArchiveModal.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showArchiveModal, () => {
          const node = useEditorStore.getState().node
          goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
          openModal(useEditorStore.getState().node.id)
        })
      },
      '$mod+Enter': (event) => {
        if (open) {
          event.preventDefault()
          handleDelete()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, open, del, shortcutDisabled, location.pathname])

  // console.log({ to, from, open });

  const handleDeleteChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    saveAndClearBuffer()
    if (newValue) {
      setDel(newValue)
    }
  }

  // const { del, mockData, open } = deleteState
  useEffect(() => {
    if (del && !isReserved(del)) {
      setMockRefactored(getMockArchive(del).archivedNodes.map((item) => item.path))
    }
  }, [del])

  const handleDelete = async () => {
    if (del && !isReserved(del)) {
      const res = await execArchive(del)
      if (res) {
        goTo(ROUTE_PATHS.node, NavigationType.replace, res.toLoad)
      }
    }
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Archive</ModalHeader>
      <WrappedNodeSelect
        autoFocusSelectAll
        autoFocus
        // menuOpen
        disallowReserved
        defaultValue={del ?? useEditorStore.getState().node.path}
        handleSelectItem={handleDeleteChange}
      />

      {mockRefactored.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Please confirm archiving the node(s):</h1>
            <p>{mockRefactored.length} changes</p>
          </MRMHead>
          {mockRefactored.map((d) => (
            <MRMRow key={`DelNodeModal_${d}`}>
              <DeleteIcon>
                <Icon icon={archiveLine}></Icon>
              </DeleteIcon>
              <p>{d}</p>
            </MRMRow>
          ))}
        </MockRefactorMap>
      )}
      <ModalControls>
        <Button large onClick={handleCancel}>
          Cancel
          <DisplayShortcut shortcut={'Esc'} />
        </Button>
        <Button large primary disabled={mockRefactored.length < 1} onClick={handleDelete}>
          Archive
          <DisplayShortcut shortcut={'$mod+Enter'} />
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Delete

import arrowRightLine from '@iconify-icons/ri/arrow-right-line'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { isReserved } from '../../../utils/lib/paths'
import tinykeys from 'tinykeys'
import create from 'zustand'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { Button } from '../../../style/Buttons'
import { NodeLink } from '../../../types/relations'
import { WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'
import { mog } from '../../../utils/lib/helper'

// Prefill modal has been added to the Tree via withRefactor from useRefactor

interface RefactorState {
  open: boolean
  focus: boolean
  mockRefactored: NodeLink[]
  from: string | undefined
  to: string | undefined
  openModal: () => void
  closeModal: () => void
  setMockRefactored: (mR: NodeLink[]) => void
  setFocus: (focus: boolean) => void
  setFrom: (from: string) => void
  setTo: (from: string) => void
  prefillModal: (from: string, to: string) => void
}

export const useRefactorStore = create<RefactorState>((set) => ({
  open: false,
  mockRefactored: [],
  from: undefined,
  to: undefined,
  focus: true,
  openModal: () =>
    set({
      open: true
    }),
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

const Refactor = () => {
  const open = useRefactorStore((store) => store.open)
  const focus = useRefactorStore((store) => store.focus)
  const to = useRefactorStore((store) => store.to)
  const from = useRefactorStore((store) => store.from)
  const mockRefactored = useRefactorStore((store) => store.mockRefactored)
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const openModal = useRefactorStore((store) => store.openModal)
  const closeModal = useRefactorStore((store) => store.closeModal)
  const setMockRefactored = useRefactorStore((store) => store.setMockRefactored)
  const setTo = useRefactorStore((store) => store.setTo)
  const setFrom = useRefactorStore((store) => store.setFrom)

  const { push } = useNavigation()
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRefactor.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showRefactor, () => {
          openModal()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled])

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

  const { getMockRefactor, execRefactor } = useRefactor()
  const { getUidFromNodeId } = useLinks()

  useEffect(() => {
    if (to && from && !isReserved(from) && !isReserved(to)) {
      // mog('To, from in refactor', { to, from })
      setMockRefactored(getMockRefactor(from, to))
    }
  }, [to, from])

  // console.log({ mockRefactored });

  const handleRefactor = () => {
    const res = execRefactor(from, to)
    const path = useEditorStore.getState().node.id
    const nodeid = useEditorStore.getState().node.nodeid
    if (doesLinkRemain(path, res)) {
      push(nodeid, { savePrev: false })
    } else if (res.length > 0) {
      const nodeid = getUidFromNodeId(res[0].to)
      push(nodeid, { savePrev: false })
    }
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Refactor</ModalHeader>

      <WrappedNodeSelect
        // defaultValue={from}
        placeholder="Refactor From Node..."
        menuOpen={focus}
        autoFocus={focus}
        defaultValue={from ?? useEditorStore.getState().node.id}
        highlightWhenSelected
        disallowReserved
        iconHighlight={from !== undefined}
        handleSelectItem={handleFromChange}
      />

      <WrappedNodeSelect
        // defaultValue={to}
        placeholder="Refactor To Node..."
        highlightWhenSelected
        createAtTop
        disallowClash
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
        <Button primary autoFocus={!focus} large onClick={handleRefactor}>
          Apply Refactor
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Refactor

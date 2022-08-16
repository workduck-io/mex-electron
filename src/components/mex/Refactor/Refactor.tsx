import { hierarchyParser } from '@hooks/useHierarchy'
import arrowRightLine from '@iconify/icons-ri/arrow-right-line'
import { Icon } from '@iconify/react'
import useDataStore from '@store/useDataStore'
import { Button, DisplayShortcut } from '@workduck-io/mex-components'
import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { tinykeys } from '@workduck-io/tinykeys'
import create from 'zustand'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { NodeLink } from '../../../types/relations'
import { mog } from '../../../utils/lib/helper'
import { isMatch, isReserved } from '../../../utils/lib/paths'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

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
  prefillModal: (from: string, to?: string) => void
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
  prefillModal: (from: string, to?: string) =>
    set({
      from,
      to,
      open: true,
      focus: false
    })
}))

/*
 * Refactor modal
 *
 * Allows user to refactor a node to a different path
 *
 * Shows mock refactored nodes before executing
 */
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
  const setBaseNodeId = useDataStore((store) => store.setBaseNodeId)

  const { push } = useNavigation()
  const { updateILinks } = useLinks()
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRefactor.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showRefactor, () => {
          openModal()
        })
      },
      '$mod+Enter': (event) => {
        if (open) {
          event.preventDefault()
          mog('Refactor Enter')
          handleRefactor()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, to, from, open])

  const handleFromChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    if (newValue) {
      setFrom(newValue)
    }
  }

  const handleToChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    if (newValue) {
      setTo(newValue)
    }
  }

  const handleToCreate = (quickLink: QuickLink) => {
    const inputValue = quickLink.value
    if (inputValue) {
      setTo(inputValue)
    }
  }

  const { getMockRefactor, execRefactorAsync } = useRefactor()
  const { getNodeidFromPath } = useLinks()

  useEffect(() => {
    // mog('Refactor', { open, to, from })
    if (to && from && !isReserved(from) && !isReserved(to)) {
      // mog('To, from in refactor', { to, from })
      setMockRefactored(getMockRefactor(from, to, true, false))
    }
  }, [to, from, open])

  // console.log({ mockRefactored });

  const handleRefactor = async () => {
    mog('Refactor', { open, to, from })
    if (to && from && !isReserved(from) && !isReserved(to)) {
      const res = await execRefactorAsync(from, to)

      const { addedPaths, removedPaths } = res
      const addedILinks = hierarchyParser(addedPaths)
      const removedILinks = hierarchyParser(removedPaths)

      mog('RESULT OF REFACTORING', { addedILinks, removedILinks })

      // // * set the new hierarchy in the tree
      const refactored = updateILinks(addedILinks, removedILinks)

      // const baseId = linkInRefactor(useDataStore.getState().baseNodeId, refactored)
      // if (baseId !== false) {
      //   setBaseNodeId(baseId.to)
      // }

      const path = useEditorStore.getState().node.path
      const nodeid = useEditorStore.getState().node.nodeid

      if (doesLinkRemain(path, refactored)) {
        push(nodeid, { savePrev: false })
      } else if (res.length > 0) {
        const nodeid = getNodeidFromPath(res[0].to)
        push(nodeid, { savePrev: false })
      }
    }

    closeModal()
  }

  // mog('Refactor', { open, focus, to, from, mockRefactored })
  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Refactor</ModalHeader>

      <WrappedNodeSelect
        // defaultValue={from}
        placeholder="Refactor From Node..."
        menuOpen={focus}
        autoFocus={focus}
        autoFocusSelectAll
        defaultValue={from ?? useEditorStore.getState().node.path}
        highlightWhenSelected
        disallowReserved
        iconHighlight={from !== undefined}
        handleSelectItem={handleFromChange}
      />

      <WrappedNodeSelect
        // defaultValue={to}
        placeholder="Refactor To Node..."
        highlightWhenSelected
        disallowMatch={(path) => isMatch(path, from)}
        createAtTop
        disallowClash
        iconHighlight={to !== undefined}
        defaultValue={to ?? ''}
        handleSelectItem={handleToChange}
        handleCreateItem={handleToCreate}
      />

      {mockRefactored.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Notes being refactored... </h1>
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
          Apply
          <DisplayShortcut shortcut={'$mod+Enter'} />
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Refactor

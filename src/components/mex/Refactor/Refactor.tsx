import React, { useEffect } from 'react'

// import { hierarchyParser } from '@hooks/useHierarchy'
import arrowRightLine from '@iconify/icons-ri/arrow-right-line'
import { Icon } from '@iconify/react'
import useDataStore from '@store/useDataStore'
import Modal from 'react-modal'
import create from 'zustand'

import { Button, DisplayShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

// import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { NodeLink } from '../../../types/relations'
import { mog } from '../../../utils/lib/helper'
import { isMatch, isReserved } from '../../../utils/lib/paths'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'
import { useUserPreferenceStore } from '@store/userPreferenceStore'

interface RefactorPath {
  path: string
  namespaceID?: string
}

// Prefill modal has been added to the Tree via withRefactor from useRefactor
interface RefactorState {
  open: boolean
  focus: boolean
  mockRefactored: NodeLink[]
  from: string | undefined
  to: string | undefined
  fromNS: string | undefined
  toNS: string | undefined
  openModal: () => void
  closeModal: () => void
  setMockRefactored: (mR: NodeLink[]) => void
  setFocus: (focus: boolean) => void
  setFrom: (from: RefactorPath) => void
  setTo: (from: RefactorPath) => void
  prefillModal: (from: RefactorPath, to?: RefactorPath) => void
}

export const useRefactorStore = create<RefactorState>((set) => ({
  open: false,
  mockRefactored: [],
  from: undefined,
  to: undefined,
  fromNS: undefined,
  toNS: undefined,
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
  setFrom: (from: RefactorPath) => set({ from: from.path, fromNS: from.namespaceID }),
  setTo: (to: RefactorPath) => set({ to: to.path, toNS: to.namespaceID }),
  prefillModal: (from: RefactorPath, to?: RefactorPath) =>
    set({
      from: from.path,
      fromNS: from.namespaceID,
      to: to?.path,
      toNS: to?.namespaceID,
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
  const fromNS = useRefactorStore((store) => store.fromNS)
  const toNS = useRefactorStore((store) => store.toNS)
  const mockRefactored = useRefactorStore((store) => store.mockRefactored)
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const openModal = useRefactorStore((store) => store.openModal)
  const closeModal = useRefactorStore((store) => store.closeModal)
  const setMockRefactored = useRefactorStore((store) => store.setMockRefactored)
  const setTo = useRefactorStore((store) => store.setTo)
  const setFrom = useRefactorStore((store) => store.setFrom)
  // const setBaseNodeId = useDataStore((store) => store.setBaseNodeId)
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)
  // const layoutStore = useLayoutStore((store) => store.sidebar)
  const { push } = useNavigation()
  // const { updateILinks } = useLinks()
  const { shortcutDisabled, shortcutHandler } = useKeyListener()
  const namespaces = useDataStore((store) => store.namespaces)

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
    const newNS = quickLink.namespace ?? namespaces[0].id
    if (newValue && newNS) {
      setFrom({ path: newValue, namespaceID: newNS })
    }
  }

  const handleToChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    const newNS = quickLink.namespace ?? currentSpace ?? namespaces[0].id
    if (newValue && newNS) {
      setTo({ path: newValue, namespaceID: newNS })
    }
  }

  const handleToCreate = (quickLink: QuickLink) => {
    const inputValue = quickLink.value
    const newNS = currentSpace ?? namespaces[0].id
    if (inputValue && newNS) {
      setTo({ path: inputValue, namespaceID: newNS })
    }
  }

  const { getMockRefactor, execRefactorAsync } = useRefactor()

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
      const refactored = await execRefactorAsync({ path: from, namespaceID: fromNS }, { path: to, namespaceID: toNS })

      const path = useEditorStore.getState().node.path
      const nodeid = useEditorStore.getState().node.nodeid

      if (doesLinkRemain(path, refactored)) {
        push(nodeid, { savePrev: false })
      }
      // What is this code? Isn't res an object, what does res[0] refer to?
      // else if (res.length > 0) {
      //   const nodeid = getNodeidFromPath(res[0].to)
      //   push(nodeid, { savePrev: false })
      // }
    }

    closeModal()
  }

  // mog('Refactor', { open, focus, to, from, mockRefactored })
  return (
    // eslint-disable-next-line
    // @ts-ignore
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

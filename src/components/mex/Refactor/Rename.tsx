import arrowRightLine from '@iconify-icons/ri/arrow-right-line'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { isReserved } from '../../../utils/lib/paths'
import tinykeys from 'tinykeys'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useRenameStore } from '../../../store/useRenameStore'
import { Button } from '../../../style/Buttons'
import { WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

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

  const { getUidFromNodeId } = useLinks()
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRename.keystrokes]: (event) => {
        event.preventDefault()
        // TODO: Fix the shortcut handler (not working after the shortcut is renamed)
        // shortcutHandler(shortcuts.showRename, () => {
        // console.log({ event })
        openModal(useEditorStore.getState().node.id)
        // })
      }
    })
    // console.log(shortcuts.showRename)
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
    if (to && from && !isReserved(to)) {
      setMockRefactored(getMockRefactor(from, to))
    }
  }, [to, from])

  const handleRefactor = () => {
    if (to && from) {
      const res = execRefactor(from, to)

      const path = useEditorStore.getState().node.id
      const nodeid = useEditorStore.getState().node.nodeid
      if (doesLinkRemain(path, res)) {
        push(nodeid)
      } else if (res.length > 0) {
        const nodeid = getUidFromNodeId(res[0].to)
        push(nodeid)
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
        autoFocus={to === undefined}
        menuOpen={to === undefined}
        defaultValue={to}
        disallowReserved
        createAtTop
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
        <Button primary large onClick={handleRefactor}>
          Apply Rename
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Rename

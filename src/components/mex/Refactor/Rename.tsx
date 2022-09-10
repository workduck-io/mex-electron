import React, { useEffect } from 'react'

import arrowRightLine from '@iconify/icons-ri/arrow-right-line'
import { Icon } from '@iconify/react'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { mog } from '@utils/lib/helper'
import Modal from 'react-modal'

import { Button, DisplayShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { useSaveData } from '../../../hooks/useSaveData'
import { useEditorStore } from '../../../store/useEditorStore'
import { useRenameStore } from '../../../store/useRenameStore'
import { isMatch, isReserved } from '../../../utils/lib/paths'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

const Rename = () => {
  const { execRefactorAsync, getMockRefactor } = useRefactor()
  const { push } = useNavigation()
  const { saveData } = useSaveData()

  const open = useRenameStore((store) => store.open)
  const to = useRenameStore((store) => store.to)
  const from = useRenameStore((store) => store.from)

  const fromNS = useRenameStore((store) => store.fromNS)
  const toNS = useRenameStore((store) => store.toNS)

  const mockRefactored = useRenameStore((store) => store.mockRefactored)
  const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const setTo = useRenameStore((store) => store.setTo)
  const setFrom = useRenameStore((store) => store.setFrom)
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)

  const handleFromChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    const newNS = quickLink.namespace
    if (newValue) {
      setFrom({ path: newValue, namespaceID: newNS })
    }
  }

  const handleToChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    const newNS = quickLink.namespace ?? currentSpace
    if (newValue) {
      mog('setTo newNS', { newValue, newNS, quickLink })
      setTo({ path: newValue, namespaceID: newNS })
    }
  }

  const handleToCreate = (quickLink: QuickLink) => {
    const inputValue = quickLink.value
    const newNS = quickLink.namespace ?? currentSpace
    if (inputValue) {
      mog('setTo newNS', { inputValue, newNS, quickLink })
      setTo({ path: inputValue, namespaceID: newNS })
    }
  }

  // const { from, to, open, mockRefactor } = renameState

  useEffect(() => {
    if (to && from && !isReserved(from) && !isReserved(from)) {
      // mog('To, from in rename', { to, from })
      setMockRefactored(getMockRefactor(from, to))
    }
  }, [to, from])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': (event) => {
        if (open) {
          event.preventDefault()
          handleRefactor()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [open, to, from])

  const handleRefactor = async () => {
    if (to && from && !isReserved(from) && !isReserved(from)) {
      const refactored = await execRefactorAsync({ path: from, namespaceID: fromNS }, { path: to, namespaceID: toNS })

      mog('RESULT OF Renaming', { refactored })

      saveData()

      // const baseId = linkInRefactor(useDataStore.getState().baseNodeId, mockRefactored)
      // if (baseId !== false) {
      //   setBaseNodeId(baseId.to)
      // }

      const nodeid = useEditorStore.getState().node.nodeid

      if (doesLinkRemain(nodeid, refactored)) {
        push(nodeid, { savePrev: false })
      }

      // What is this code? Isn't res an object, what does res[0] refer to?
      // res == result == refactored
      else if (refactored.length > 0) {
        const nodeid = refactored[0].nodeid
        push(nodeid, { savePrev: false })
      }
    }

    closeModal()
  }

  // mog('RenameComponent', { mockRefactored, to, from, ilinks: useDataStore.getState().ilinks })

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Rename</ModalHeader>

      <WrappedNodeSelect
        placeholder="Rename node from..."
        defaultValue={
          from
            ? { path: from, namespace: fromNS }
            : { path: useEditorStore.getState().node.path, namespace: useEditorStore.getState().node.namespace }
        }
        disallowReserved
        highlightWhenSelected
        iconHighlight={from !== undefined}
        handleSelectItem={handleFromChange}
      />

      <WrappedNodeSelect
        placeholder="Rename node to..."
        autoFocus={to === undefined}
        menuOpen={to === undefined}
        defaultValue={to && { path: to, namespace: toNS }}
        disallowClash
        disallowMatch={(path) => isMatch(path, from)}
        createAtTop
        highlightWhenSelected
        iconHighlight={to !== undefined}
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
        <Button primary large onClick={handleRefactor}>
          Apply
          <DisplayShortcut shortcut={'$mod+Enter'} />
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Rename

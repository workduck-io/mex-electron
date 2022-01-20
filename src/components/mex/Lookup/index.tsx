import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import tinykeys from 'tinykeys'
import NodeSelect from '../NodeSelect/NodeSelect'
import { StyledInputWrapper } from '../NodeSelect/NodeSelect.styles'

import toast from 'react-hot-toast'
import styled from 'styled-components'
import { IpcAction } from '../../../Data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import useDataStore from '../../../store/useDataStore'
import { useHelpStore } from '../../../store/useHelpStore'
import useOnboard from '../../../store/useOnboarding'

const StyledModal = styled(Modal)`
  z-index: 10010000;
`

const Lookup = () => {
  const [open, setOpen] = useState(false)
  const [tempClose, setTempClose] = useState(false)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const setStep = useOnboard((s) => s.setStep)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)

  const shortcuts = useHelpStore((store) => store.shortcuts)

  const openModal = () => {
    setOpen(true)
    // searchInput.current.focus();
  }

  const closeModal = () => {
    setOpen(false)
  }

  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showLookup.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showLookup, () => {
          openModal()
          if (isOnboarding) {
            changeOnboarding(false)
            setTempClose(true)
            setStep(2) // * Start with Tour node
          }
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, isOnboarding])

  const { getUidFromNodeId } = useLinks()
  const { push } = useNavigation()
  const addILink = useDataStore((s) => s.addILink)

  const openNode = (value: string) => {
    const uid = getUidFromNodeId(value)
    push(uid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, value)
    closeModal()
  }

  const handleSelectItem = (inputValue: string) => {
    if (tempClose) {
      if (inputValue === 'tour') {
        changeOnboarding(true)
        openNode(inputValue)
        // performClick()
      } else toast('Please select "tour" node')
    } else {
      openNode(inputValue)
    }
  }

  const handleCreateItem = (inputValue: string) => {
    if (tempClose) return
    const uid = addILink(inputValue)
    push(uid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, inputValue)
    closeModal()
  }

  return (
    <StyledModal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <h1>Lookup</h1>
      <StyledInputWrapper>
        <NodeSelect
          id="lookup"
          name="lookup"
          menuOpen
          autoFocus
          prefillRecent
          handleSelectItem={handleSelectItem}
          handleCreateItem={handleCreateItem}
        />
      </StyledInputWrapper>
      {/* <LookupInput autoFocus menuOpen handleChange={handleChange} handleCreate={handleCreate} /> */}
    </StyledModal>
  )
}

export default Lookup

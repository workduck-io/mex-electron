import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import { useHistory } from 'react-router-dom'
import { useEditorStore } from '../../../store/useEditorStore'
import styled from 'styled-components'
import tinykeys from 'tinykeys'
import { useApi } from '../../../apis/useSaveApi'
import { IpcAction } from '../../../data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import useDataStore from '../../../store/useDataStore'
import { useHelpStore } from '../../../store/useHelpStore'
import useOnboard from '../../../store/useOnboarding'
import NodeSelect from '../NodeSelect/NodeSelect'
import { StyledInputWrapper } from '../NodeSelect/NodeSelect.styles'
import { mog } from '../../../utils/lib/helper'

const StyledModal = styled(Modal)`
  z-index: 10010000;
`

const Lookup = () => {
  const [open, setOpen] = useState(false)
  const [tempClose, setTempClose] = useState(false)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const setStep = useOnboard((s) => s.setStep)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const { saveNewNodeAPI } = useApi()

  const history = useHistory()
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
    const nodeid = getUidFromNodeId(value)
    push(nodeid)
    mog('HElo there', { nodeid })
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)
    closeModal()

    if (location.pathname !== '/editor') {
      history.push('/editor')
    }
  }

  const handleSelectItem = (inputValue: string) => {
    if (tempClose) {
      if (inputValue === 'tour') {
        changeOnboarding(true)
        openNode(inputValue)
        // performClick()
      } else toast('Please select "tour" node')
    } else {
      const path = useEditorStore.getState().node.title
      if (inputValue === path) {
        closeModal()
        return
      }
      openNode(inputValue)
    }
  }

  const handleCreateItem = (inputValue: string) => {
    if (tempClose) return
    const nodeid = addILink(inputValue)
    saveNewNodeAPI(nodeid)
    push(nodeid, { withLoading: false })
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)
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

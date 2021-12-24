import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import tinykeys from 'tinykeys'
import { AppType } from '../../Data/useInitialize'
import { useLinks } from '../../Editor/Actions/useLinks'
import useDataStore from '../../Editor/Store/DataStore'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import { IpcAction } from '../../Spotlight/utils/constants'
import { appNotifierWindow } from '../../Spotlight/utils/notifiers'
import { useHelpStore } from '../Help/HelpModal'
import NodeSelect from '../NodeSelect/NodeSelect'
import { StyledInputWrapper } from '../NodeSelect/NodeSelect.styles'

const Lookup = () => {
  const [open, setOpen] = useState(false)
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
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled])

  const { getUidFromNodeId } = useLinks()
  const { push } = useNavigation()
  const addILink = useDataStore((s) => s.addILink)

  const handleSelectItem = (inputValue: string) => {
    const uid = getUidFromNodeId(inputValue)
    push(uid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, inputValue)
    closeModal()
  }

  const handleCreateItem = (inputValue: string) => {
    const uid = addILink(inputValue)
    push(uid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, inputValue)
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
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
    </Modal>
  )
}

export default Lookup

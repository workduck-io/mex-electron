import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { defaultShortcuts } from '../../Defaults/shortcuts'
import tinykeys from 'tinykeys'
import create from 'zustand'
import ShortcutTable from './ShortcutTable'
import produce from 'immer'
import { HelpState } from './Help.types'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../Spotlight/utils/constants'


const HelpModal = () => {
  const open = useHelpStore((store) => store.open)
  const toggleModal = useHelpStore((store) => store.toggleModal)
  const closeModal = useHelpStore((store) => store.closeModal)

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showHelp.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showHelp, () => {
          toggleModal()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled])

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ShortcutTable />
    </Modal>
  )
}

export default HelpModal

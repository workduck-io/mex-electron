import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import tinykeys from 'tinykeys'
import useDataStore from '../../Editor/Store/DataStore'
import TreeNode from '../../Types/tree'
import { useHelpStore } from '../Help/HelpModal'
import NodeSelect from '../NodeSelect/NodeSelect'

export type LookupProps = {
  flatTree: TreeNode[]
}

const Lookup: React.FC<LookupProps> = () => {
  const [open, setOpen] = useState(false)
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const openModal = () => {
    setOpen(true)
    // searchInput.current.focus();
  }

  const closeModal = () => {
    setOpen(false)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showLookup.keystrokes]: (event) => {
        event.preventDefault()
        openModal()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  const { push } = useNavigation()
  const addILink = useDataStore((s) => s.addILink)

  const handleSelectItem = (inputValue: string) => {
    push(inputValue)
    closeModal()
  }

  const handleCreateItem = (inputValue: string) => {
    addILink(inputValue)
    push(inputValue)
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <h1>Lookup</h1>
      <div>
        <NodeSelect
          menuOpen
          autoFocus
          prefillLast
          handleSelectItem={handleSelectItem}
          handleCreateItem={handleCreateItem}
        />
      </div>
      {/* <LookupInput autoFocus menuOpen handleChange={handleChange} handleCreate={handleCreate} /> */}
    </Modal>
  )
}

export default Lookup

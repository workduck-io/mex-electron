import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { ActionMeta } from 'react-select'
import tinykeys from 'tinykeys'
import useDataStore, { useFlatTreeFromILinks } from '../../Editor/Store/DataStore'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { getNodeFlatTree } from '../../Lib/flatTree'
import TreeNode from '../../Types/tree'
import { useHelpStore } from '../Help/HelpModal'
import { Value } from '../NodeInput/Types'
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

  const loadNode = useEditorStore((s) => s.loadNode)
  const loadNodeFromId = useEditorStore((s) => s.loadNodeFromId)
  const addILink = useDataStore((s) => s.addILink)

  const flattree = useFlatTreeFromILinks()
  // console.log({ flatTree, open });

  const handleChange = (
    newValue: Value | null,
    _actionMeta: ActionMeta<Value> // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    // setState({ ...state, value: newValue });
    if (newValue) {
      const node = getNodeFlatTree(newValue.value, flattree)
      if (node.length > 0) {
        loadNode(node[0])
      }
    }
    closeModal()
  }

  const handleSelectItem = (inputValue: string) => {
    loadNodeFromId(inputValue)
    closeModal()
  }

  const handleCreateItem = (inputValue: string) => {
    addILink(inputValue)
    loadNodeFromId(inputValue)
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <h1>Lookup</h1>
      <div>
        <NodeSelect menuOpen autoFocus handleSelectItem={handleSelectItem} handleCreateItem={handleCreateItem} />
      </div>
      {/* <LookupInput autoFocus menuOpen handleChange={handleChange} handleCreate={handleCreate} /> */}
    </Modal>
  )
}

export default Lookup

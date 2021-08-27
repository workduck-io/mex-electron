import deleteBin2Line from '@iconify-icons/ri/delete-bin-2-line'
import { Icon } from '@iconify/react'
import { rgba } from 'polished'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { ActionMeta } from 'react-select'
import { css } from 'styled-components'
import tinykeys from 'tinykeys'
import { useDelete } from '../../Editor/Actions/useDelete'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import LookupInput from '../NodeInput/NodeSelect'
import { Value } from '../NodeInput/Types'
import { DeleteIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from './styles'

interface DeleteState {
  open: boolean
  del: string
  mockData: string[]
}

const Delete = () => {
  const { getMockDelete, execDelete } = useDelete()
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)

  const [deleteState, setDeleteState] = useState<DeleteState>({
    open: false,
    del: '',
    mockData: []
  })

  const openModal = () => {
    const nodeId = useEditorStore.getState().node.id
    setDeleteState({
      open: true,
      del: nodeId,
      mockData: getMockDelete(nodeId)
    })
  }

  const closeModal = () => {
    setDeleteState({
      open: false,
      del: '',
      mockData: []
    })
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyK KeyD': (event) => {
        event.preventDefault()
        openModal()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  // console.log({ to, from, open });

  const handleDeleteChange = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    if (newValue) {
      const { value } = newValue
      setDeleteState({
        ...deleteState,
        del: value,
        mockData: getMockDelete(value)
      })
    }
  }

  // useEffect(() => {
  //   // console.log({ to, from });
  //   if (to && from) {
  //     // setMockRename(getMockRefactor(from, to));
  //   }
  // }, [to, from, getMockRefactor]);

  // console.log({ mockRefactored });

  const { del, mockData, open } = deleteState

  const handleDelete = () => {
    const { newLinks } = execDelete(del)
    if (newLinks.length > 0) loadNodeFromId(newLinks[0].text)
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  return (
    <Modal className="RefactorContent" overlayClassName="RefactorOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Delete</ModalHeader>

      <LookupInput autoFocus defaultValue={useEditorStore.getState().node.id} handleChange={handleDeleteChange} />

      {mockData.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Please confirm deleting the node(s):</h1>
            <p>{mockData.length} changes</p>
          </MRMHead>
          {mockData.map((d) => (
            <MRMRow key={`DelNodeModal_${d}`}>
              <DeleteIcon>
                <Icon icon={deleteBin2Line}></Icon>
              </DeleteIcon>
              <p>{d}</p>
            </MRMRow>
          ))}
        </MockRefactorMap>
      )}
      <ModalControls>
        <Button size="large" primary onClick={handleDelete}>
          Delete
        </Button>
        <Button size="large" onClick={handleCancel}>
          Cancel Culture
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Delete

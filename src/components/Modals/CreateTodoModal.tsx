import React, { useEffect, useState } from 'react'

import { getPlateEditorRef, PlateProvider } from '@udecode/plate'
import toast from 'react-hot-toast'
import Modal from 'react-modal'

import { Button, DisplayShortcut, LoadingButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

// import useUpdateBlock from '../../editor/Hooks/useUpdateBlock'
// import { useApi } from '../../Hooks/API/useNodeAPI'
// import useModalStore, { ModalsType } from '../../Stores/useModalStore'
// import { ModalControls, ModalHeader } from '../../Style/Refactor'

import TaskEditor from '../CreateTodoModal/TaskEditor'
import { ScrollableModalSection, TaskEditorWrapper } from '../CreateTodoModal/TaskEditor/styled'
import { mog } from '@workduck-io/mex-utils'
import { useApi } from '@apis/useSaveApi'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { ModalControls, ModalHeader } from '@components/mex/Refactor/styles'
import useUpdateBlock from '@hooks/useUpdateBlock'

const CreateTodoModal = () => {
  const isOpen = useModalStore((store) => store.open === ModalsType.todo)
  const setOpen = useModalStore((store) => store.toggleOpen)
  const setModalData = useModalStore((store) => store.setData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { appendToNode } = useApi()
  const { addBlockInContent } = useUpdateBlock()

  const onCreateTask = async () => {
    setIsLoading(true)
    const openedTodo = useModalStore.getState().data
    const todoBlock = getPlateEditorRef()?.children

    if (openedTodo) {
      try {
        if (todoBlock) {
          await appendToNode(openedTodo.nodeid, todoBlock)
          addBlockInContent(openedTodo.nodeid, todoBlock)
          toast('Task created!')
        }
      } catch (err) {
        toast('Error occured while creating Task')
        mog('Error occured while creating Task', { err })
      } finally {
        setIsLoading(false)
        setOpen(undefined)
      }
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setModalData(undefined)
    }
  }, [isOpen])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': (event) => {
        if (isOpen) {
          event.preventDefault()
          onCreateTask()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [isOpen])

  if (!isOpen) return <></>

  const onRequestClose = () => {
    const todo = useModalStore.getState().data

    if (todo) {
      setModalData(undefined)
    }

    setOpen(undefined)
  }

  return (
    <Modal
      className={'ModalContentSplit'}
      overlayClassName="ModalOverlay"
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      <ScrollableModalSection>
        <ModalHeader>New Task</ModalHeader>
        <NewTodoSection />
        <ModalControls>
          <Button large onClick={onRequestClose}>
            Cancel
          </Button>
          <LoadingButton
            style={{ marginLeft: '1rem' }}
            primary
            autoFocus={true}
            large
            loading={isLoading}
            onClick={onCreateTask}
            disabled={false}
          >
            Add <DisplayShortcut shortcut={'$mod+Enter'} />
          </LoadingButton>
        </ModalControls>
      </ScrollableModalSection>
    </Modal>
  )
}

const NewTodoSection = () => {
  const todo = useModalStore((store) => store.data)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onEditorChange = (val) => {}

  if (!todo) return <></>

  const todoEditorId = `${todo.nodeid}_task_${todo.id}`

  return (
    <TaskEditorWrapper>
      <PlateProvider id={todoEditorId}>
        <TaskEditor editorId={todoEditorId} content={todo?.content} onChange={onEditorChange} />
      </PlateProvider>
    </TaskEditorWrapper>
  )
}

export default CreateTodoModal
import React, { useEffect, useMemo, useState } from 'react'

import { useApi } from '@apis/useSaveApi'
import { TodoType } from '@editor/Components/Todo/types'
import useEntityAPIs from '@hooks/useEntityAPIs'
import { useTodoBuffer } from '@hooks/useTodoBuffer'
import useTodoBufferStore from '@hooks/useTodoBufferStore'
import { useUpdater } from '@hooks/useUpdater'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { PlateProvider } from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import toast from 'react-hot-toast'
import Modal from 'react-modal'

import { Button, DisplayShortcut, LoadingButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { ModalControls, ModalHeader } from '../Refactor/styles'
import TaskEditor from './TaskEditor'
import { ScrollableModalSection, TaskEditorWrapper } from './TaskEditor/styled'

const CreateTodoModal = () => {
  const isOpen = useModalStore((store) => store.open === ModalsType.todo)
  const setOpen = useModalStore((store) => store.toggleOpen)
  const { clearAndSaveTodo, removeTodoFromBuffer } = useTodoBuffer()
  const { createTodo } = useEntityAPIs()
  const { getNoteTodo } = useTodoBuffer()
  const setModalData = useModalStore((store) => store.setData)
  const { updateTodoInContent } = useUpdater()
  const { appendToNoteAPI } = useApi()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onCreateTask = async () => {
    setIsLoading(true)
    const openedTodo = useModalStore.getState().data

    const todoBuffer = getNoteTodo(openedTodo.nodeid, openedTodo.entityId)

    if (todoBuffer) {
      const { type, ...todo } = todoBuffer

      try {
        const savedTodo = await createTodo(todo)

        if (savedTodo) {
          clearAndSaveTodo(savedTodo)
          appendToNoteAPI(savedTodo.nodeid, '', savedTodo.content)
          updateTodoInContent(savedTodo.nodeid, [savedTodo])
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
        if (open) {
          event.preventDefault()
          onCreateTask()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [open])

  if (!isOpen) return <></>

  const onRequestClose = () => {
    const todo: TodoType = useModalStore.getState().data
    if (todo) {
      removeTodoFromBuffer(todo.nodeid, todo.entityId)
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
            autoFocus={!focus}
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
  const [updated, setUpdated] = useState(false)

  const onEditorChange = () => {}

  useEffect(() => {
    if (todo && !updated) {
      useTodoBufferStore.getState().update(todo.nodeid, todo)
      setUpdated(true)
    }
  }, [todo, updated])

  const todoEditorId = useMemo(() => `${todo.nodeid}_task_${todo.entityId}`, [todo])

  if (!todo) return <></>

  return (
    <TaskEditorWrapper>
      <PlateProvider id={todoEditorId}>
        <TaskEditor editorId={todoEditorId} content={todo?.content} onChange={onEditorChange} />
      </PlateProvider>
    </TaskEditorWrapper>
  )
}

export default CreateTodoModal

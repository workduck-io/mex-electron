import { BASE_TASKS_PATH } from '@data/Defaults/baseData'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { Button, LoadingButton } from '@workduck-io/mex-components'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { QuickLink } from '../NodeSelect/NodeSelect'
import { ModalControls, ModalHeader, ModalSection } from '../Refactor/styles'
import TaskEditor from './TaskEditor'
import { useLinks } from '@hooks/useLinks'
import { createDefaultTodo } from '@store/useTodoStore'
import { useTodoBuffer } from '@hooks/useTodoBuffer'
import { TodoType } from '@editor/Components/Todo/types'
import useEntityAPIs from '@hooks/useEntityAPIs'
import { TaskEditorWrapper } from './TaskEditor/styled'
import { mog } from '@utils/lib/helper'
import { getPlateEditorRef } from '@udecode/plate'
import useTodoBufferStore from '@hooks/useTodoBufferStore'
import toast from 'react-hot-toast'
import { useContentStore } from '@store/useContentStore'

const CreateTodoModal = () => {
  const open = useModalStore((store) => store.open)
  const setOpen = useModalStore((store) => store.toggleOpen)
  const { getNodeidFromPath } = useLinks()
  const { addTodoInBuffer, getTodoFromBuffer, clearAndSaveTodo } = useTodoBuffer()
  const { createTodo } = useEntityAPIs()
  const setModalData = useModalStore((store) => store.setData)
  const isOpen = open === ModalsType.todo
  const updateTodoContentInEditor = useContentStore((store) => store.updateTodosContent)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (isOpen) {
      const dailyNotesId = getNodeidFromPath(BASE_TASKS_PATH)
      const todo = useModalStore.getState().data

      if (todo) {
        const bufferTodo = getTodoFromBuffer(todo.nodeid, todo.entityId)

        // * If existing todo buffer present, load that content
        if (bufferTodo) {
          setModalData(bufferTodo)
          return
        }

        addTodoInBuffer(todo.nodeid, todo)
      } else if (dailyNotesId) {
        const todo = createDefaultTodo(dailyNotesId)
        addTodoInBuffer(dailyNotesId, todo)
        setModalData(todo)
      }
    }
  }, [isOpen])

  if (!isOpen) return <></>

  const onRequestClose = () => {
    const todo: TodoType = useModalStore.getState().data
    if (todo) {
      setModalData(undefined)
    }
    setOpen(undefined)
  }

  const onCreateTask = async () => {
    const modalData = useModalStore.getState().data
    const todo = getTodoFromBuffer(modalData.nodeid, modalData.entityId)
    try {
      setIsLoading(true)
      const savedTodo = await createTodo(todo)

      if (savedTodo) {
        clearAndSaveTodo(savedTodo)
        updateTodoContentInEditor(savedTodo.nodeid, [savedTodo])
        toast('Task created!')
      }
    } catch (err) {
      toast('Error occured while creating Task')
    } finally {
      setIsLoading(false)
      setOpen(undefined)
    }
  }

  return (
    <Modal
      className={'ModalContentSplit'}
      overlayClassName="ModalOverlay"
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      <ModalSection>
        <ModalHeader>Add a New Task</ModalHeader>
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
            Add
          </LoadingButton>
        </ModalControls>
      </ModalSection>
    </Modal>
  )
}

const NewTodoSection = ({ onSelectNote }: { onSelectNote?: (item: QuickLink) => void }) => {
  const todo = useModalStore((store) => store.data)
  const todos = useTodoBufferStore((store) => store.todosBuffer)

  const { updateNoteTodo } = useTodoBuffer()

  const onEditorChange = (val: any) => {
    if (todo) {
      updateNoteTodo(todo.nodeid, todo.entityId, { content: val })
    }
  }

  const handleSelectItem = (item: QuickLink) => {
    onSelectNote(item)
  }

  if (!todo) return <></>
  mog('TODO IS', { todo, ed: getPlateEditorRef() })

  return (
    <TaskEditorWrapper>
      <TaskEditor editorId={todo.nodeid} content={todo.content} onChange={onEditorChange} />
    </TaskEditorWrapper>
  )
}

export default CreateTodoModal

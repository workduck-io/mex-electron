import { BASE_TASKS_PATH } from '@data/Defaults/baseData'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { Button, DisplayShortcut, LoadingButton } from '@workduck-io/mex-components'
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
import toast from 'react-hot-toast'
import { useUpdater } from '@hooks/useUpdater'
import { useEditorBuffer } from '@hooks/useEditorBuffer'
import { tinykeys } from '@workduck-io/tinykeys'
import { useNamespaces } from '@hooks/useNamespaces'
import { PlateProvider } from '@udecode/plate'

const CreateTodoModal = () => {
  const isOpen = useModalStore((store) => store.open === ModalsType.todo)
  const setOpen = useModalStore((store) => store.toggleOpen)
  const { getNodeidFromPath } = useLinks()
  const { addTodoInBuffer, getTodoFromBuffer, clearAndSaveTodo } = useTodoBuffer()
  const { createTodo } = useEntityAPIs()
  const setModalData = useModalStore((store) => store.setData)
  const { updateTodoInContent } = useUpdater()
  const { saveAndClearBuffer } = useEditorBuffer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { getDefaultNamespaceId } = useNamespaces()

  useEffect(() => {
    if (isOpen) {
      const defaultNamespaceId = getDefaultNamespaceId()
      const dailyNotesId = getNodeidFromPath(BASE_TASKS_PATH, defaultNamespaceId)
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
    } else {
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
      setModalData(undefined)
    }
    setOpen(undefined)
  }

  const onCreateTask = async () => {
    setIsLoading(true)
    const modalData = useModalStore.getState().data
    const todo = getTodoFromBuffer(modalData.nodeid, modalData.entityId)
    try {
      const savedTodo = await createTodo(todo)

      if (savedTodo) {
        clearAndSaveTodo(savedTodo)
        updateTodoInContent(savedTodo.nodeid, [savedTodo], true)
        saveAndClearBuffer()
        toast('Task created!')
      }
    } 
    catch (err) {
      toast('Error occured while creating Task')
      mog('Error occured while creating Task', { err })
    } 
      finally {
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
      </ModalSection>
    </Modal>
  )
}

const NewTodoSection = ({ onSelectNote }: { onSelectNote?: (item: QuickLink) => void }) => {
  const todo = useModalStore((store) => store.data)

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

  const todoEditorId = `${todo.nodeid}_task_${todo.entityId}`

  return (
    <PlateProvider id={todoEditorId}>
      <TaskEditorWrapper>
        <TaskEditor editorId={todoEditorId} content={todo.content} onChange={onEditorChange} />
      </TaskEditorWrapper>
    </PlateProvider>
  )
}

export default CreateTodoModal

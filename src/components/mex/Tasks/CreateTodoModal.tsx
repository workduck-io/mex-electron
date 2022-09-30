import React, { useEffect, useState } from 'react'

import { useApi } from '@apis/useSaveApi'
import { defaultContent } from '@data/Defaults/baseData'
import { TodoType } from '@editor/Components/Todo/types'
import { useEditorBuffer } from '@hooks/useEditorBuffer'
import useEntityAPIs from '@hooks/useEntityAPIs'
import { useTodoBuffer } from '@hooks/useTodoBuffer'
import { useUpdater } from '@hooks/useUpdater'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { getPlateEditorRef, PlateProvider } from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import toast from 'react-hot-toast'
import Modal from 'react-modal'

import { Button, DisplayShortcut, LoadingButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { QuickLink } from '../NodeSelect/NodeSelect'
import { ModalControls, ModalHeader, ModalSection } from '../Refactor/styles'
import TaskEditor from './TaskEditor'
import { TaskEditorWrapper } from './TaskEditor/styled'

const CreateTodoModal = () => {
  const isOpen = useModalStore((store) => store.open === ModalsType.todo)
  const setOpen = useModalStore((store) => store.toggleOpen)
  const { clearAndSaveTodo, removeTodoFromBuffer } = useTodoBuffer()
  const { createTodo } = useEntityAPIs()
  const setModalData = useModalStore((store) => store.setData)
  const { updateTodoInContent } = useUpdater()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { appendToNoteAPI } = useApi()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onCreateTask = async () => {
    setIsLoading(true)
    const todo = useModalStore.getState().data

    try {
      const savedTodo = await createTodo(todo)

      if (savedTodo) {
        clearAndSaveTodo(savedTodo)
        saveAndClearBuffer()
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
  const setModalData = useModalStore((store) => store.setData)

  const onEditorChange = (content: any) => {
    if (todo) {
      setModalData({ ...todo, content })
    }
  }

  const handleSelectItem = (item: QuickLink) => {
    onSelectNote(item)
  }

  if (!todo) return <></>

  const todoEditorId = `hello_${todo.nodeid}_task_${todo.entityId}`

  const e = getPlateEditorRef()
  mog('SOM', { f: e })
  mog('TODO IS', { todo })

  return (
    <PlateProvider id={todoEditorId}>
      <TaskEditorWrapper>
        <TaskEditor
          editorId={todoEditorId}
          content={todo?.content || defaultContent.content}
          onChange={onEditorChange}
        />
      </TaskEditorWrapper>
    </PlateProvider>
  )
}

export default CreateTodoModal

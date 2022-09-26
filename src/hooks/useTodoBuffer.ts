import { TodoType } from '@editor/Components/Todo/types'
import useTodoStore, { createDefaultTodo } from '@store/useTodoStore'
import { runBatch } from '@utils/lib/batchPromise'
import { getMentionsFromContent, getTagsFromContent } from '@utils/lib/content'
import { mog } from '@utils/lib/helper'
import { checkIsEqual } from '@utils/lib/objects'
import { serializeTodo } from '@utils/lib/serialize'
import { isEmpty } from 'lodash'

import { NodeEditorContent } from '../types/Types'
import useEntityAPIs from './useEntityAPIs'
import useTodoBufferStore, { NoteTodoBufferType, TodoBufferType } from './useTodoBufferStore'

export const useTodoBuffer = () => {
  const { updateTodos } = useEntityAPIs()
  const setTodosBuffer = useTodoBufferStore((store) => store.setTodosBuffer)
  const updateTodoBuffer = useTodoBufferStore((store) => store.update)
  const addTodoInStore = useTodoStore((store) => store.addTodoInNode)
  const setNodeTodos = useTodoStore((store) => store.setNodeTodos)
  const removeTodoFromBuffer = useTodoBufferStore((store) => store.removeTodo)
  const removeNoteBuffer = useTodoBufferStore((store) => store.remove)
  /*
    Adds given Todo to respecive Note's Todo buffer.
  */
  const addTodoInBuffer = (noteId: string, todo: TodoType) => {
    updateTodoBuffer(noteId, todo)
  }

  /*
    Adds all Todo changes to Buffer. 
  */
  const addInBuffer = (noteId: string, todos: NodeEditorContent) => {
    const todoBuffer = todos.reduce((prev, todoContent) => {
      const todo = getNoteTodo(noteId, todoContent.entityId) || createDefaultTodo(noteId, [todoContent])
      const tags = getTagsFromContent([todoContent])
      const mentions = getMentionsFromContent([todoContent])

      if (todo)
        return {
          ...prev,
          [todo.entityId]: {
            ...todo,
            content: [todoContent],
            entityMetadata: { ...todo.entityMetadata, tags, mentions }
          }
        }
    }, {})

    mog('todos', { todos })

    setTodosBuffer(noteId, todoBuffer)
  }

  /*
    Clears the buffer after saving all todo buffer changes.
    Checks All Notes buffer, if there's any change calls `Batch update` Todos
  */
  const flushTodosBuffer = async () => {
    const todosInBuffer = useTodoBufferStore.getState().todosBuffer
    const getNodeTodos = useTodoStore.getState().getNodeTodos

    if (!isTodosBufferEmpty()) {
      const todosSaveRequests = []

      Object.entries(todosInBuffer).forEach(([noteId, todosBuffer]) => {
        if (todosInBuffer[noteId]) {
          const existingTodo = getNodeTodos(noteId)?.reduce((prev, todo) => {
            if (todo.entityId) {
              return { ...prev, [todo.entityId]: todo }
            }
          }, {})

          // * UPDATED, DELETED todos
          const updatedTodos = getUpdatedTodos(existingTodo, todosBuffer)
          const serializedTodos = updatedTodos.map(serializeTodo)

          if (serializedTodos.length > 0) {
            const req = updateTodos(serializedTodos)
              .then((d) => {
                if (isEmpty(d?.UnprocessedItems)) {
                  setNodeTodos(noteId, Object.values(todosBuffer))
                  removeNoteBuffer(noteId)
                }
              })
              .catch((err) => {
                mog(`Error occured while saving ${noteId} - Todos buffer`, { err })
              })

            todosSaveRequests.push(req)
          }
        }
      })

      if (todosSaveRequests.length > 0) {
        await runBatch(todosSaveRequests)
      }
    }
  }

  /* Todo change type setter */
  const setTodoUpdateType = <T extends Record<string, unknown>>(todo: T, type: 'UPDATE' | 'DELETE') => ({
    ...todo,
    type
  })

  /*
    Returns Updated/Deleted todos List from existing and new todos record.
    Adds type 'UPDATE' or 'DELETE' based on change.
  */
  const getUpdatedTodos = (existing: NoteTodoBufferType = {}, newTodos: NoteTodoBufferType) => {
    const updatedTodos = []

    Object.entries(existing).forEach(([entityId, todo]) => {
      if (!newTodos[entityId]) updatedTodos.push(setTodoUpdateType(todo, 'DELETE'))
    })

    Object.entries(newTodos).forEach(([entityId, todo]) => {
      const existingTodo = existing[entityId]
      if (existingTodo) {
        if (
          !checkIsEqual(existingTodo, todo, ['lastEditedBy', 'publicAccess', 'updatedAt', 'createdAt', 'createdBy'])
        ) {
          updatedTodos.push(setTodoUpdateType(todo, 'UPDATE'))
        }
      } else updatedTodos.push(setTodoUpdateType(todo, 'UPDATE'))
    })

    return updatedTodos
  }

  /*
    Returns existing todos of a Note
  */
  const getExistingTodos = (noteId: string): NoteTodoBufferType => {
    const existingTodos = useTodoStore.getState().getNodeTodos(noteId) || []
    const todoRecord = existingTodos.reduce((prev, todo) => ({ ...prev, [todo.entityId]: todo }), {})
    return todoRecord
  }

  /*
    Get Todo of a Note
    - Checks if it's present in Todos Buffer. Otherwise, returns todo from existing Todos if present
  */
  const getNoteTodo = (noteId: string, todoEntityId: string) => {
    const todoFromBuffer = getTodoFromBuffer(noteId, todoEntityId)

    if (todoFromBuffer) return todoFromBuffer

    const existingTodos = getExistingTodos(noteId)
    if (existingTodos?.[todoEntityId]) return existingTodos?.[todoEntityId]
  }

  const clearAndSaveTodo = (todo: TodoType) => {
    removeTodoFromBuffer(todo.nodeid, todo.entityId)
    addTodoInStore(todo.nodeid, todo)
  }

  /*
    Update Fields of given Todo
    Eg: 'status' of todo or 'priority' of Todo
  */
  const updateNoteTodo = (noteId: string, todoEntityId: string, updateFields: Partial<Omit<TodoType, 'entityId'>>) => {
    const noteTodosBuffer = getNoteTodosBuffer(noteId)
    if (noteTodosBuffer) {
      const todo: TodoType = noteTodosBuffer[todoEntityId]

      if (todo) {
        const updatedTodo = { ...todo, ...updateFields }
        updateTodoBuffer(noteId, updatedTodo)
      }
    }
  }

  const getTodoFromBuffer = (noteId: string, todoEntityId: string) => {
    if (!isTodosBufferEmpty(noteId)) {
      const bufferTodos = getNoteTodosBuffer(noteId)

      if (bufferTodos?.[todoEntityId]) {
        return bufferTodos?.[todoEntityId]
      }
    }
  }

  /*
    Checks if Todos Buffer is Empty
    If 'noteId' is present, checks status of that Note's Buffer. 
  */
  const isTodosBufferEmpty = (noteId?: string) => {
    const todosBuffer = useTodoBufferStore.getState().todosBuffer

    if (noteId) return isEmpty(todosBuffer?.[noteId])
    return isEmpty(todosBuffer)
  }

  const getTodosBuffer = (): TodoBufferType => useTodoBufferStore.getState().todosBuffer
  const getNoteTodosBuffer = (noteId: string): NoteTodoBufferType => useTodoBufferStore.getState().todosBuffer?.[noteId]

  return {
    addInBuffer,
    getTodosBuffer,
    getTodoFromBuffer,
    getNoteTodosBuffer,
    addTodoInBuffer,
    flushTodosBuffer,
    updateNoteTodo,
    isTodosBufferEmpty,
    getNoteTodo,
    clearAndSaveTodo
  }
}

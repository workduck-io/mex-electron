import { createDefaultTodo } from '@editor/Components/Todo/todoUtils'
import { TodoType } from '@editor/Components/Todo/types'
import useTodoStore from '@store/useTodoStore'
import { produce } from 'immer'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { getMentionsFromContent, getTagsFromContent, mog } from '@workduck-io/mex-utils'

import { NodeEditorContent } from '../types/Types'

export type NoteTodoBufferType = Record<string, TodoType> // * entityId, TodoEntity
export type TodoBufferType = Record<string, NoteTodoBufferType> // * NoteId, NoteTodoBufferType

type TodoBufferStore = {
  todosBuffer: TodoBufferType
  setTodosBuffer: (noteId: string, todos: NoteTodoBufferType) => void
  add: (noteId: string, todoBlock?: NodeEditorContent) => void
  update: (noteId: string, todo: TodoType) => void // * Adds or Updates the buffer
  updateTodoContent: (noteId: string, entityId: string, content: NodeEditorContent) => void
  remove: (noteId: string) => void // * Deletes Node's Buffer
  removeTodo: (noteId: string, entityId: string) => void
  updateTodoType: (noteId: string, entityId: string, todoType: 'UPDATE' | 'DELETE') => void
  clear: () => void
  isFetching?: boolean
  addTodosInBuffer: (noteId: string, todos: NoteTodoBufferType) => void
  setIsFetching: (isFetching: boolean) => void
  initializeTodosBuffer: (todosBuffer: TodoBufferType) => void
}

const useTodoBufferStore = create<TodoBufferStore>()(
  devtools(
    persist(
      (set, get) => ({
        todosBuffer: {},
        setTodosBuffer: (noteId, todos) => {
          const buffer = get().todosBuffer
          if (!noteId) return
          set({ todosBuffer: { ...buffer, [noteId]: todos } })
        },
        update: (noteId, todo) => {
          const buffer = get().todosBuffer || {}
          const noteBuffer = buffer?.[noteId] || {}

          set(
            produce((draft) => {
              draft.todosBuffer[noteId] = { ...noteBuffer, [todo.entityId]: todo }
            })
          )
        },
        addTodosInBuffer: (noteId, todos) => {
          const buffer = get().todosBuffer || {}
          const noteBuffer = buffer?.[noteId] || {}

          set(
            produce((draft) => {
              draft.todosBuffer[noteId] = { ...noteBuffer, ...todos }
            })
          )
        },
        updateTodoType: (noteId: string, entityId: string, todoType: 'UPDATE' | 'DELETE') => {
          const buffer = get().todosBuffer || {}
          const noteBuffer = buffer?.[noteId] || {}
          const todo = noteBuffer?.[entityId] || useTodoStore.getState().getTodoOfNode(noteId, entityId)

          if (todo) {
            set(
              produce((draft) => {
                draft.todosBuffer[noteId] = {
                  ...noteBuffer,
                  [entityId]: {
                    ...todo,
                    type: todoType
                  }
                }
              })
            )
          }
        },
        updateTodoContent: (noteId, entityId, content) => {
          const buffer = get().todosBuffer || {}
          const noteBuffer = buffer?.[noteId] || {}
          const todo = noteBuffer?.[entityId] || useTodoStore.getState().getTodoOfNode(noteId, entityId)

          if (todo) {
            const tags = getTagsFromContent(content)
            const mentions = getMentionsFromContent(content)

            set(
              produce((draft) => {
                draft.todosBuffer[noteId] = {
                  ...noteBuffer,
                  [entityId]: {
                    ...todo,
                    content,
                    entityMetadata: {
                      ...todo.entityMetadata,
                      tags,
                      mentions
                    }
                  }
                }
              })
            )
          }
        },
        add: (noteId, content) => {
          const todo = createDefaultTodo(noteId, content)
          const buffer = get().todosBuffer || {}
          const noteBuffer = buffer?.[noteId] || {}

          if (todo) {
            set(
              produce((draft) => {
                draft.todosBuffer[noteId] = { ...noteBuffer, [todo.entityId]: todo }
              })
            )
          }
        },
        remove: (noteId) => {
          const newBuffer = get().todosBuffer
          if (newBuffer[noteId]) delete newBuffer[noteId]
          set({ todosBuffer: newBuffer })
        },
        removeTodo: (noteId, entityId) => {
          const newBuffer = get().todosBuffer
          if (newBuffer?.[noteId]) {
            const { [entityId]: removedItem, ...noteTodosBuffer } = newBuffer[noteId]
            set(
              produce((draft) => {
                draft.todosBuffer[noteId] = noteTodosBuffer || {}
              })
            )
          }
        },
        initializeTodosBuffer: (todosBuffer) => {
          mog(' ------ Initializing TODOs Buffer --------', { todosBuffer })
          set({ todosBuffer })
        },
        clear: () => set({ todosBuffer: {} }),
        isFetching: false,
        setIsFetching: (isFetching) => set({ isFetching })
      }),
      {
        name: 'Todos Buffer Store'
      }
    ),
    {
      name: 'Todos Buffer Store'
    }
  )
)

export default useTodoBufferStore

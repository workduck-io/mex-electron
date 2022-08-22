import { TodoType } from '@editor/Components/Todo/types'
import { mog } from '@utils/lib/helper'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { produce } from 'immer'

export type NoteTodoBufferType = Record<string, TodoType> // * entityId, TodoEntity
export type TodoBufferType = Record<string, NoteTodoBufferType> // * NoteId, NoteTodoBufferType

type TodoBufferStore = {
  todosBuffer: TodoBufferType
  setTodosBuffer: (noteId: string, todos: NoteTodoBufferType) => void
  update: (noteId: string, todo: TodoType) => void // * Adds or Updates the buffer
  remove: (noteId: string) => void // * Deletes Node's Buffer
  removeTodo: (noteId: string, entityId: string) => void
  clear: () => void
  initializeTodosBuffer: (todosBuffer: TodoBufferType) => void
}

const useTodoBufferStore = create<TodoBufferStore>(
  devtools((set, get) => ({
    todosBuffer: {},
    setTodosBuffer: (noteId, todos) => {
      const buffer = get().todosBuffer
      if (!noteId) return
      set({ todosBuffer: { ...buffer, [noteId]: todos } })
    },
    update: (noteId, todo) => {
      const buffer = get().todosBuffer || {}
      const noteBuffer = buffer?.[noteId] || {}
      set(produce(draft => {
        draft.todosBuffer[noteId] = { ...noteBuffer, [todo.entityId]: todo } 
      }))
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
        set(produce(draft => {
          draft.todosBuffer = { todosBuffer: { ...newBuffer, [noteId]: noteTodosBuffer || {} } }
        }))
      }
    },
    initializeTodosBuffer: (todosBuffer) => set({ todosBuffer }),
    clear: () => set({ todosBuffer: {} })
  }))
)

export default useTodoBufferStore

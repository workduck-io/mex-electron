import create from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultContent } from '../data/Defaults/baseData'
import { TodoType, TodoStatus, PriorityType } from '../editor/Components/Todo/types'
import { NodeEditorContent } from '../types/Types'

type TodoStoreType = {
  todos: TodoType[]
  setTodos: (todos: TodoType[]) => void
  addTodo: (id: string, nodeid: string) => TodoType
  getTodo: (id: string, nodeid: string) => TodoType | undefined
  updateTodo: (todo: TodoType) => void
  updateContent: (id: string, content: NodeEditorContent) => void
  clearStore: () => void
}

const useTodoStore = create<TodoStoreType>(
  persist(
    (set, get) => ({
      todos: [],
      setTodos: (todos: TodoType[]) => set({ todos }),
      addTodo: (id: string, nodeid: string) => {
        const todo = {
          id,
          nodeid,
          content: defaultContent.content,
          metadata: {
            status: TodoStatus.todo,
            priority: PriorityType.low
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        }

        const newTodos = [todo, ...get().todos]
        set({ todos: newTodos })

        return todo
      },
      getTodo: (id: string, nodeid: string) => {
        const todo = get().todos.find((todo) => todo.id === id && nodeid === todo.nodeid)
        if (!todo) return get().addTodo(id, nodeid)
        return todo
      },
      updateTodo: (todo: TodoType) => {
        const newTodos = get().todos.map((t) => (t.id === todo.id ? todo : t))
        set({ todos: newTodos })
      },
      updateContent: (id: string, content: NodeEditorContent) => {
        set({ todos: get().todos.map((t) => (t.id === id ? { ...t, content, updatedAt: Date.now() } : t)) })
      },
      clearStore: () => set({ todos: [] })
    }),
    { name: 'todo-mex' }
  )
)

export default useTodoStore

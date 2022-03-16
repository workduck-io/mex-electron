import create from 'zustand'
import { defaultContent } from '../data/Defaults/baseData'
import { TodoType, TodoStatus, PriorityType, TodosType } from '../editor/Components/Todo/types'
import { NodeEditorContent } from '../types/Types'
import { mog } from '../utils/lib/helper'

const createTodo = (nodeid: string, todoId: string, content: NodeEditorContent = defaultContent.content) => ({
  id: todoId,
  nodeid,
  content,
  metadata: {
    status: TodoStatus.todo,
    priority: PriorityType.noPriority
  },
  createdAt: Date.now(),
  updatedAt: Date.now()
})

type TodoStoreType = {
  // * For all nodes
  todos: TodosType
  clearTodos: () => void
  initTodos: (todos: TodosType) => void

  // * Update specific node todos
  setNodeTodos: (nodeid: string, todos: Array<TodoType>) => void
  addTodoInNode: (nodeid: string, todo: TodoType) => void
  getTodoOfNode: (nodeid: string, todoId: string) => TodoType | undefined
  updateTodoOfNode: (nodeid: string, todo: TodoType) => void
  replaceContentOfTodos: (nodeid: string, todosContent: NodeEditorContent) => void
}

const useTodoStore = create<TodoStoreType>((set, get) => ({
  todos: {},
  initTodos: (todos) => {
    if (todos) {
      set({ todos })
    }
  },
  clearTodos: () => set({ todos: {} }),

  addTodoInNode: (nodeid, todo) => {
    const todos = get().todos ?? {}

    const nodeTodos = todos?.[nodeid] ?? []
    set({ todos: { ...todos, [nodeid]: [todo, ...nodeTodos] } })
  },
  getTodoOfNode: (nodeid, todoId) => {
    const todo = get().todos?.[nodeid]?.find((todo) => todo.id === todoId && nodeid === todo.nodeid)

    // mog('getTodoOfNode', { nodeid, todoId, todo })
    if (!todo) {
      const newTodo = createTodo(nodeid, todoId)
      get().addTodoInNode(nodeid, newTodo)

      return newTodo
    }

    return todo
  },

  setNodeTodos: (nodeid, todos) => {
    const currentTodos = get().todos ?? {}
    const newTodos = { ...currentTodos, [nodeid]: todos }
    set({ todos: newTodos })
  },
  updateTodoOfNode: (nodeid, todo) => {
    const currentTodos = get().todos ?? {}

    const todos = currentTodos?.[nodeid] ?? []
    const newTodos = todos.map((t) =>
      t.id === todo.id && todo.nodeid === nodeid ? { ...todo, updatedAt: Date.now() } : t
    )
    // mog('currentTodos', { newTodos, nodeid, todos })
    set({ todos: { ...currentTodos, [nodeid]: newTodos } })
  },
  replaceContentOfTodos: (nodeid, todosContent) => {
    if (!nodeid) return
    const todos = get().todos ?? {}

    if (todosContent.length === 0) {
      if (!todos[nodeid]) return

      delete todos[nodeid]
      set({ todos })

      return
    }

    const nodeTodos = todosContent.map((content) => {
      const todo = todos[nodeid]?.find((todo) => todo.id === content.id && nodeid === todo.nodeid)
      // mog('replaceContent', { nodeid, todosContent, nodeTodos, todo, content })
      return todo ? { ...todo, content: [content] } : createTodo(nodeid, content.id, [content])
    })
    const newtodos = { ...todos, [nodeid]: nodeTodos }
    // mog('newTodos', { newtodos })
    set({ todos: newtodos })
  }
}))

export default useTodoStore

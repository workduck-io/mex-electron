import create from 'zustand'
import { defaultContent } from '../data/Defaults/baseData'
import { TodoType, TodoStatus, PriorityType, TodosType } from '../editor/Components/Todo/types'
import { NodeEditorContent } from '../types/Types'

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
  initTodos: (todos) => set({ todos }),
  clearTodos: () => set({ todos: {} }),

  addTodoInNode: (nodeid, todo) => {
    const nodeTodos = get().todos[nodeid] ?? []
    set({ todos: { ...get().todos, [nodeid]: [todo, ...nodeTodos] } })
  },
  getTodoOfNode: (nodeid, todoId) => {
    const todo = get().todos[nodeid]?.find((todo) => todo.id === todoId && nodeid === todo.nodeid)

    if (!todo) {
      const newTodo = createTodo(nodeid, todoId)
      get().addTodoInNode(nodeid, newTodo)

      return newTodo
    }

    return todo
  },

  setNodeTodos: (nodeid, todos) => {
    const newTodos = { ...get().todos, [nodeid]: todos }
    set({ todos: newTodos })
  },
  updateTodoOfNode: (nodeid, todo) => {
    const todos = get().todos[nodeid] ?? []
    const newTodos = todos.map((t) =>
      t.id === todo.id && todo.nodeid === nodeid ? { ...todo, updatedAt: Date.now() } : t
    )
    set({ todos: { ...get().todos, [nodeid]: newTodos } })
  },
  replaceContentOfTodos: (nodeid, todosContent) => {
    const todos = get().todos

    if (todosContent.length === 0) {
      if (!todos[nodeid]) return

      delete todos[nodeid]
      set({ todos })

      return
    }

    const nodeTodos = todosContent.map((content) => {
      const todo = todos[nodeid]?.find((todo) => todo.id === content.id && nodeid === todo.nodeid)
      return todo ? { ...todo, content: [content] } : createTodo(nodeid, content.id, [content])
    })
    set({ todos: { ...todos, [nodeid]: nodeTodos } })
  }
}))

export default useTodoStore

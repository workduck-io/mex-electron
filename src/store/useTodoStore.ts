import { getMentionsFromContent, getTagsFromContent } from '@utils/lib/content'
import { produce } from 'immer'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { defaultContent, getDefaultTodo } from '../data/Defaults/baseData'
import { TodoType, TodoStatus, PriorityType, TodosType } from '../editor/Components/Todo/types'
import { useReminderStore } from '../hooks/useReminders'
import { NodeEditorContent } from '../types/Types'
import { convertContentToRawText } from '../utils/search/parseData'

export const createDefaultTodo = (nodeid: string, content?: NodeEditorContent): TodoType => {
  const defaultTodo = getDefaultTodo()
  const block = content?.[0]

  return {
    id: block?.id || defaultTodo.blockId,
    entityId: block?.entityId || defaultTodo.entityId,
    nodeid,
    content: content || defaultTodo.content,
    entityMetadata: block?.entityMetadata || defaultTodo.entityMetadata
  }
}

type TodoStoreType = {
  // * For all nodes
  todos: TodosType
  clearTodos: () => void
  initTodos: (todos: TodosType) => void

  // * Update specific node todos
  setNodeTodos: (nodeid: string, todos: Array<TodoType>) => void
  addTodoInNode: (nodeid: string, todo: TodoType) => void
  getTodoOfNode: (nodeid: string, todoId: string) => TodoType | undefined
  getTodoOfNodeWithoutCreating: (nodeid: string, todoId: string) => TodoType | undefined
  updateTodoOfNode: (nodeid: string, todo: TodoType) => void
  updateTodosOfNode: (nodeId: string, todos: Array<TodoType>) => void
  updateTodosOfNodes: (notesWithTodos: Record<string, TodoType>) => void
  replaceContentOfTodos: (nodeid: string, todosContent: NodeEditorContent) => void
  getAllTodos: () => TodosType
  getNodeTodos: (nodeId: string) => Array<TodoType> | undefined
  updatePriorityOfTodo: (nodeid: string, todoId: string, priority: PriorityType) => void
  updateStatusOfTodo: (nodeid: string, todoId: string, status: TodoStatus) => void
}

const useTodoStore = create<TodoStoreType>()(
  devtools((set, get) => ({
    todos: {},
    initTodos: (todos) => {
      if (todos) {
        set({ todos })
      }
    },
    clearTodos: () => set({ todos: {} }),

    addTodoInNode: (nodeid, todo) => {
      if (!nodeid) {
        return
      }
      const todos = get().todos ?? {}

      const nodeTodos = todos?.[nodeid]?.filter((existingTodo) => existingTodo.entityId !== todo.entityId) || []

      set({ todos: { ...todos, [nodeid]: [todo, ...nodeTodos] } })
    },
    getTodoOfNodeWithoutCreating: (nodeid, todoId) => {
      const todo = get().todos?.[nodeid]?.find((todo) => todo.entityId === todoId && nodeid === todo.nodeid)
      return todo
    },

    getTodoOfNode: (nodeid, todoId) => {
      const todo = get().todos?.[nodeid]?.find((todo) => todo.entityId === todoId && nodeid === todo.nodeid)
      // mog('getTodoOfNode', { nodeid, todoId, todo })
      // if (!todo) {
      //   const newTodo = createTodo(nodeid, todoId)
      //   if (!nodeid) return newTodo
      //   get().addTodoInNode(nodeid, newTodo)

      //   return newTodo
      // }
      return todo
    },

    updateTodosOfNode: (nodeId: string, todos: Array<TodoType>) => {
      const allTodos = get().todos || {}
      const nodeTodos = allTodos?.[nodeId]

      if (nodeTodos) {
        const newTodos = nodeTodos.map((todo) => {
          const updatedTodo = todos.find((t) => t.entityId === todo.entityId)
          return updatedTodo || todo
        })

        set(
          produce((draft) => {
            draft.todos[nodeId] = newTodos
          })
        )
      } else {
        set(
          produce((draft) => {
            draft.todos[nodeId] = todos
          })
        )
      }
    },
    updateTodosOfNodes: (nodesWithTodos) => {
      set(
        produce((draft) => {
          const existingTodos = draft.todos || {}
          draft.todos = { ...existingTodos, ...nodesWithTodos }
        })
      )
    },

    getAllTodos: () => {
      const allTodos = Object.entries(get().todos).reduce((acc, [nodeid, todos]) => {
        const newTodos = todos.filter((todo) => {
          // TODO: Find a faster way to check for empty content
          const text = convertContentToRawText(todo.content)?.trim()
          // mog('empty todo check', { text, nodeid, todo })
          if (text === '') {
            return false
          }
          if (todo.content === defaultContent.content) return false
          return true
        })

        return { ...acc, [nodeid]: newTodos }
      }, {})
      return allTodos
    },
    getNodeTodos: (nodeId: string) => {
      const currentTodos = get().todos || {}
      return currentTodos[nodeId]
    },
    setNodeTodos: (nodeid, todos) => {
      // mog('setNodeTodos', { nodeid, todos })
      if (!nodeid) return
      const currentTodos = get().todos ?? {}
      const newTodos = { ...currentTodos, [nodeid]: todos }
      set({ todos: newTodos })
    },
    updateTodoOfNode: (nodeid, todo) => {
      // mog('updateNodeTodos', { nodeid, todo })
      if (!nodeid) return
      const currentTodos = get().todos ?? {}

      const todos = currentTodos?.[nodeid] ?? []
      const newTodos = todos.map((t) =>
        t.entityId === todo.entityId && todo.nodeid === nodeid ? { ...todo, updatedAt: Date.now() } : t
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

      const nTodo = todos[nodeid] ?? []
      const nodeTodos = []

      todosContent.forEach((content) => {
        const todo = nTodo.find((todo) => todo.entityId === content.entityId && nodeid === todo.nodeid)
        const tags = getTagsFromContent([content])
        const mentions = getMentionsFromContent([content])
        // mog('replaceContent', { nodeid, tags, mentions, todosContent, nodeTodos, todo, content })

        if (todo) {
          nodeTodos.push({ ...todo, mentions, tags, content: [content] })
        } else {
          // const newTodo = createTodo(nodeid, content.id, [content], mentions, tags)
          // useTodoBufferStore.getState().update(nodeid, newTodo)
        }
      })

      const leftOutTodos = nTodo.filter(
        (todo) => !nodeTodos.find((t) => t.entityId === todo.entityId && nodeid === t.nodeid)
      )

      const reminders = useReminderStore.getState().reminders
      const setReminders = useReminderStore.getState().setReminders
      const newReminders = reminders.filter(
        (reminder) => !leftOutTodos.find((todo) => todo.entityId === reminder.todoid)
      )

      setReminders(newReminders)
      const newtodos = { ...todos, [nodeid]: nodeTodos }
      set({ todos: newtodos })
    },
    updatePriorityOfTodo: (nodeid, todoId, priority) => {
      // mog('updatePro', { nodeid, todoId, priority })
      if (!nodeid) return
      const todo = get().getTodoOfNodeWithoutCreating(nodeid, todoId)
      if (!todo) return

      const newTodo = { ...todo, entityMetadata: { ...todo.entityMetadata, priority } }
      get().updateTodoOfNode(nodeid, newTodo)
    },
    updateStatusOfTodo: (nodeid, todoId, status) => {
      // mog('updateSta', { nodeid, todoId, status })
      if (!nodeid) return
      const todo = get().getTodoOfNodeWithoutCreating(nodeid, todoId)
      if (!todo) return

      const newTodo = { ...todo, entityMetadata: { ...todo.entityMetadata, status } }
      get().updateTodoOfNode(nodeid, newTodo)
    }
  }))
)

export default useTodoStore

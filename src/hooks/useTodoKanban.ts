import { ELEMENT_TODO_LI } from '@udecode/plate'
import { defaultContent } from '../data/Defaults/baseData'
import { SNIPPET_PREFIX } from '../data/Defaults/idPrefixes'
import { PriorityType, TodoRanks, TodoStatus, TodoStatusRanks, TodoType } from '../editor/Components/Todo/types'
import useTodoStore from '../store/useTodoStore'

export interface TodoKanbanCard {
  id: string
  todo: TodoType
}

export interface KanbanBoardColumn {
  id: TodoStatus
  title: string
  cards: TodoKanbanCard[]
}

export interface KanbanBoard {
  columns: KanbanBoardColumn[]
}

export const useTodoKanban = () => {
  const updateTodo = useTodoStore((store) => store.updateTodoOfNode)

  const changeStatus = (todo: TodoType, newStatus: TodoStatus) => {
    updateTodo(todo.nodeid, { ...todo, metadata: { ...todo.metadata, status: newStatus } })
  }

  const changePriority = (todo: TodoType, newPriority: PriorityType) => {
    updateTodo(todo.nodeid, { ...todo, metadata: { ...todo.metadata, priority: newPriority } })
  }

  const getPureContent = (todo: TodoType) => {
    const { content } = todo
    if (content.length > 0) {
      if (content[0].type !== ELEMENT_TODO_LI) return content
      else return content[0].children
    }
    return defaultContent
  }
  const getTodoBoard = () => {
    const nodetodos = useTodoStore.getState().todos
    const todoBoard: KanbanBoard = {
      columns: [
        {
          id: TodoStatus.todo,
          title: 'Todo',
          cards: []
        },
        {
          id: TodoStatus.pending,
          title: 'In Progress',
          cards: []
        },
        {
          id: TodoStatus.completed,
          title: 'Completed',
          cards: []
        }
      ]
    }
    Object.entries(nodetodos).forEach(([nodeid, todos]) => {
      if (nodeid.startsWith(SNIPPET_PREFIX)) return
      todos.forEach((todo) => {
        todoBoard.columns
          .find((column) => column.id === todo.metadata.status)
          .cards.push({
            id: `KANBAN_ID_${todo.nodeid}_${todo.id}`,
            todo: todo
          })
      })
    })

    todoBoard.columns.forEach((column) => {
      column.cards.sort((a, b) => {
        if (TodoRanks[a.todo.metadata.priority] < TodoRanks[b.todo.metadata.priority]) return 1
        else return -1
      })
    })

    todoBoard.columns.sort((a, b) => {
      if (TodoStatusRanks[a.id] > TodoStatusRanks[b.id]) return 1
      else return -1
    })

    return todoBoard
  }
  return {
    getPureContent,
    getTodoBoard,
    changePriority,
    changeStatus
  }
}

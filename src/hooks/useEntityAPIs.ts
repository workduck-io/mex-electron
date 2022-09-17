import { apiURLs } from '@apis/routes'
import { TodoType } from '@editor/Components/Todo/types'
import { useAuthStore } from '@services/auth/useAuth'
import useTodoStore from '@store/useTodoStore'
import { getTodosFromContent } from '@utils/lib/content'
import { mog } from '@utils/lib/helper'
import { deserializeTodos, serializeTodo } from '@utils/lib/serialize'

import { client } from '@workduck-io/dwindle'

import { NodeEditorContent } from '../types/Types'
import { useUpdater } from './useUpdater'

type UpdateTodosType = {
  entityId: string
  noteId?: string
  content?: NodeEditorContent
  properties?: Record<string, any>
  type?: 'UPDATE' | 'DELETE'
  created?: string
  modified?: string
}

type TaskEntityResponseType = {
  Items: Record<string, UpdateTodosType> | Array<UpdateTodosType>
  Failed?: Array<{ nodeid: string; reason: string }>
  lastKey?: string
}

const useEntityAPIs = () => {
  const updateTodosOfNode = useTodoStore((store) => store.updateTodosOfNode)
  const updateTodosOfNodes = useTodoStore((store) => store.updateTodosOfNodes)

  const { updateTodoInContent } = useUpdater()

  const fetchAllEntitiesOfNote = async (noteId: string, content: NodeEditorContent) => {
    const requests = []
    const todos = getTodosFromContent(content, true)

    if (todos?.length > 0) {
      requests.push(getNoteTodos(noteId))
    }

    if (requests.length > 0) {
      await Promise.allSettled(requests)
    }
  }

  // * Delete Todo
  const deleteTodo = async (entityId: string): Promise<void> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      await client.delete(apiURLs.deleteTodo(entityId), {
        headers: {
          'mex-workspace-id': workspaceId
        }
      })
    }
  }

  const getTodosOfNotes = async (noteIds: Array<string>): Promise<TaskEntityResponseType> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const reqBody = {
        nodes: noteIds
      }

      const res = await client.post<TaskEntityResponseType>(apiURLs.batchGetTasksOfNotes, reqBody, {
        headers: workspaceId
      })

      if (res?.data) {
        const notesWithTasks = res.data.Items
        if (notesWithTasks) {
          const deserializedNotesWithTodos = Object.entries(notesWithTasks).reduce((prev, current) => {
            prev[current[0]] = current[1]
            return prev
          }, {})

          mog('tasks to store', { deserializedNotesWithTodos })
          updateTodosOfNodes(deserializedNotesWithTodos)
        }

        return res.data
      }
    }
  }

  // * Todo Entity
  const updateTodos = async (todos: Array<UpdateTodosType>): Promise<any> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const res = await client.post(apiURLs.batchUpdateTodos, todos, {
        headers: {
          'mex-workspace-id': workspaceId
        }
      })

      if (res) {
        return res.data
      }
    }
  }

  const getNoteTodos = async (noteId: string) => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const res = await client.get(apiURLs.getTodosOfNote(noteId), {
        headers: {
          'mex-workspace-id': workspaceId
        }
      })

      if (res && res.data) {
        const todos = deserializeTodos(res.data)
        updateTodosOfNode(noteId, todos)
        updateTodoInContent(noteId, todos)

        return todos
      }
    }
  }

  const createTodo = async (todo: TodoType) => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const res = await client.post(apiURLs.createTodo(), serializeTodo(todo), {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'mex-workspace-id': workspaceId
        }
      })

      if (res && res.status === 200) {
        const todos = deserializeTodos([res.data])
        // mog('todos', { todos })
        return todos[0]
      }
    }
  }

  const getTodo = async (entityId: string): Promise<UpdateTodosType> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const res = await client.get<UpdateTodosType>(apiURLs.getTodo(entityId), {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'mex-workspace-id': workspaceId
        }
      })

      if (res?.data) {
        return res.data
      }
    }
  }

  const getAllTodosOfWorkspace = async (lastKey?: string): Promise<Array<TodoType>> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const url = lastKey ? `${apiURLs.getTodosOfWorkspace}?lastKey=${lastKey}` : apiURLs.getTodosOfWorkspace
      const res = await client.get<TaskEntityResponseType>(url, {
        headers: {
          'mex-workspace-id': workspaceId
        }
      })

      if (res?.data) {
        const items = deserializeTodos(res.data.Items)

        if (items.length > 0 && res.data.lastKey) {
          const data = await getAllTodosOfWorkspace(res.data.lastKey)
          items.push(...data)
        }

        return items
      }
    }
  }

  return {
    updateTodos,
    getAllTodosOfWorkspace,
    getTodo,
    createTodo,
    getTodosOfNotes,
    deleteTodo,
    getNoteTodos,
    fetchAllEntitiesOfNote
  }
}

export default useEntityAPIs

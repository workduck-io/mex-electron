import { apiURLs } from '@apis/routes'
import { useAuthStore } from '@services/auth/useAuth'
import { NodeEditorContent } from '../types/Types'
import { client } from '@workduck-io/dwindle'
import { TodoType } from '@editor/Components/Todo/types'
import { mog } from '@utils/lib/helper'
import { getTodosFromContent } from '@utils/lib/content'
import useTodoStore from '@store/useTodoStore'
import { deserializeTodos, serializeTodo } from '@utils/lib/serialize'
import { useContentStore } from '@store/useContentStore'

type UpdateTodosType = {
  entityId: string
  noteId?: string
  content?: NodeEditorContent
  properties?: Record<string, any>
  type?: 'UPDATE' | 'DELETE'
}

const useEntityAPIs = () => {
  const updateTodosOfNode = useTodoStore((store) => store.updateTodosOfNode)
  const updateTodosContentInEditor = useContentStore((store) => store.updateTodosContent)

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

  // * Todo Entity
  const updateTodos = async (todos: Array<UpdateTodosType>): Promise<any> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const res = await client.post(apiURLs.batchUpdateTodos, todos, {
        headers: {
          Accept: 'application/json, text/plain, */*',
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
          Accept: 'application/json, text/plain, */*',
          'mex-workspace-id': workspaceId
        }
      })

      if (res && res.data) {
        const todos = deserializeTodos(res.data)
        mog('UPDATING TODOS', { todos })
        updateTodosOfNode(noteId, todos)
        updateTodosContentInEditor(noteId, todos)

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
        return res.data
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

      if (res) {
        return res.data
      }
    }
  }

  const getAllTodosOfWorkspace = async (): Promise<Array<UpdateTodosType> | undefined> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const res = await client.get<Array<UpdateTodosType>>(apiURLs.getTodosOfWorkspace, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'mex-workspace-id': workspaceId
        }
      })

      if (res) {
        return res.data
      }
    }
  }

  return {
    updateTodos,
    getAllTodosOfWorkspace,
    getTodo,
    createTodo,
    getNoteTodos,
    fetchAllEntitiesOfNote
  }
}

export default useEntityAPIs

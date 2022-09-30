import { apiURLs } from '@apis/routes'
import { TodoType } from '@editor/Components/Todo/types'
import { useAuthStore } from '@services/auth/useAuth'
import { isRequestedWithin } from '@store/useApiStore'
import useTodoStore from '@store/useTodoStore'
import { getTodosFromContent } from '@utils/lib/content'
import { mog } from '@utils/lib/helper'
import { deserializeTodos, serializeTodo } from '@utils/lib/serialize'

import { client } from '@workduck-io/dwindle'

import { NodeEditorContent } from '../types/Types'
import useTodoBufferStore from './useTodoBufferStore'

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
  const initTodos = useTodoStore((store) => store.initTodos)

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

  const archiveNoteTodos = async (noteId: string): Promise<void> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      await client.delete(apiURLs.archiveNoteTodos(noteId), {
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
        headers: {
          'mex-workspace-id': workspaceId
        }
      })

      if (res?.data) {
        const notesWithTasks = res.data.Items
        if (notesWithTasks) {
          const deserializedNotesWithTodos = Object.entries(notesWithTasks).reduce((prev, [noteId, todos]) => {
            prev[noteId] = todos
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
    const url = apiURLs.getTodosOfNote(noteId)
    if (workspaceId && !isRequestedWithin(2, url)) {
      const res = await client.get(url, {
        headers: {
          'mex-workspace-id': workspaceId
        }
      })

      if (res && res.data) {
        const todos = deserializeTodos(res.data)

        updateTodosOfNode(noteId, todos)
        // updateTodoInContent(noteId, todos)

        // const currentNote = useEditorStore.getState().node
        // if (currentNote?.nodeid === noteId) useEditorStore.getState().loadNode(currentNote)

        return todos
      }
    }
  }

  const createTodo = async (todo: TodoType): Promise<TodoType> => {
    const workspaceId = useAuthStore.getState().getWorkspaceId()

    if (workspaceId) {
      const res = await client.post<TodoType>(apiURLs.createTodo(), serializeTodo(todo), {
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

        const notesTasks = items.reduce((notesTasksMap, task: TodoType) => {
          if (task.nodeid) {
            if (notesTasksMap[task.nodeid]) {
              notesTasksMap[task.nodeid].push(task)
            } else {
              notesTasksMap[task.nodeid] = [task]
            }
          } else {
            mog(`[TASK]: NodeId is not present in (${task.entityId})`)
          }

          return notesTasksMap
        }, {})

        mog('After reducer', { notesTasks, buffer: useTodoBufferStore.getState().todosBuffer }, { show: true })

        initTodos(notesTasks)

        return items
      }
    }
  }

  return {
    updateTodos,
    archiveNoteTodos,
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

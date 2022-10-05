import { getDefaultTodo } from '@data/Defaults/baseData'
import useTodoBufferStore, { NoteTodoBufferType } from '@hooks/useTodoBufferStore'
import useTodoStore from '@store/useTodoStore'

import { ELEMENT_TODO_LI, getMentionsFromContent, getTagsFromContent, mog } from '@workduck-io/mex-utils'

import { NodeEditorContent } from '../../../types/Types'
import { TodoType } from './types'

export const deleteTodoEntity = (noteId: string, todoBlock: any) => {
  if (!useTodoStore.getState().getTodoOfNode(noteId, todoBlock.entityId)) {
    useTodoBufferStore.getState().removeTodo(noteId, todoBlock?.entityId)
  } else {
    useTodoBufferStore.getState().updateTodoType(noteId, todoBlock.entityId, 'DELETE')
  }
}

export const updateTodoEntity = (
  noteId: string,
  options?: { newEntityId: boolean; todoContent?: NodeEditorContent }
) => {
  const todo = createDefaultTodo(noteId, options?.todoContent, options?.newEntityId)
  useTodoBufferStore.getState().update(noteId, todo)

  return todo
}

export const createDefaultTodo = (nodeid: string, content?: NodeEditorContent, newEntityId?: boolean): TodoType => {
  const defaultTodo = getDefaultTodo()
  const block = content?.[0]
  const tags = content ? getTagsFromContent(content) : []
  const mentions = content ? getMentionsFromContent(content) : []

  const entityId = newEntityId || !block?.entityId ? defaultTodo.entityId : block.entityId

  return {
    id: block?.id || defaultTodo.blockId,
    entityId,
    nodeid,
    content: block ? [{ ...block, entityId }] : defaultTodo.content,
    type: 'UPDATE',
    entityMetadata: {
      ...(block?.entityMetadata || defaultTodo.entityMetadata),
      tags,
      mentions
    }
  }
}

/*
 * Converts existing content to Entities
 */
export const convertContentToEntities = (
  noteId: string,
  content: NodeEditorContent,
  options?: { type: 'UPDATE' | 'PREVIEW' }
): {
  content: NodeEditorContent
  entities: { tasks: NoteTodoBufferType }
} => {
  const entities = { tasks: {} }

  const contentWithEntities = content.map((block) => {
    mog('LOGGIN block ', { block, type: block.type === ELEMENT_TODO_LI, td: ELEMENT_TODO_LI })
    const { highlight, ...restBlock } = block

    if (block?.type === ELEMENT_TODO_LI) {
      mog('LOGGIN')
      const todo = createDefaultTodo(noteId, [restBlock])
      if (todo) entities.tasks[todo.entityId] = options?.type ? { ...todo, type: options.type } : todo

      return todo.content[0]
    }

    return restBlock
  })

  return {
    entities,
    content: contentWithEntities
  }
}

/* Fills Todo entitiy blocks with store todos */

export const updateTodoInContent = (todos: Array<TodoType>, content: NodeEditorContent) => {
  if (content?.length > 0) {
    const newContent = content?.map((block) => {
      const todo = todos?.find((td) => td.entityId === block.entityId)

      return todo ? todo.content[0] : block
    })

    return newContent
  }
}

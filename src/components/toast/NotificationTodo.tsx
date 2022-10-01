import React, { useEffect, useMemo, useState } from 'react'

import { AppType } from '@data/constants'

import { IpcAction } from '../../data/IpcAction'
import { PriorityType, TodoStatus, TodoType } from '../../editor/Components/Todo/types'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import { getPureContent } from '../../hooks/useTodoKanban'
import useTodoStore from '../../store/useTodoStore'
import { Reminder } from '../../types/reminders'
import Todo, { TodoControls } from '../../ui/components/Todo'
import { mog } from '../../utils/lib/helper'

interface NotificationTodoProps {
  oid?: string
  todo: TodoType
  isNotification: boolean
  dismissNotification: () => void
  reminder: Reminder
}

const NotificationTodo = ({ todo, reminder, dismissNotification, isNotification, oid }: NotificationTodoProps) => {
  const [localTodo, setLocalTodo] = useState(todo)
  const todos = useTodoStore((state) => state.todos)
  const getTodoOfNode = useTodoStore((state) => state.getTodoOfNodeWithoutCreating)

  useEffect(() => {
    if (isNotification) {
      return
    }
    const ntodo = getTodoOfNode(todo.nodeid, todo.id)
    if (ntodo) {
      setLocalTodo(ntodo)
    }
  }, [todo, todos])

  // mog('todo', { reminder, localTodo })
  const controls: TodoControls = {
    onChangeStatus: (todoid: string, status: TodoStatus) => {
      console.log('change status', todoid, status)
      const newTodo = { ...localTodo, metadata: { ...localTodo.metadata, status } }
      setLocalTodo(newTodo)
      appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, {
        action: { type: 'todo', todoAction: 'status', value: newTodo },
        reminder
      })
    },
    onChangePriority: (todoid: string, priority: PriorityType) => {
      console.log('change priority', todoid, priority)
      const newTodo = { ...localTodo, metadata: { ...localTodo.metadata, priority } }
      appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, {
        action: { type: 'todo', todoAction: 'priority', value: newTodo },
        reminder
      })
      setLocalTodo(newTodo)
    },
    getTodo: (parentNodeId: string, todoId: string) => {
      console.log('getTodo', parentNodeId, todoId)
      return localTodo
    }
  }

  return (
    <Todo
      oid={`NotificationTodo_${todo.id}_${oid}`}
      showDelete={false}
      parentNodeId={todo?.nodeid}
      todoid={todo.id}
      controls={isNotification ? controls : undefined}
      readOnly
    >
      <EditorPreviewRenderer
        noStyle
        content={getPureContent(localTodo)}
        editorId={`NoticationTodoPreview_${isNotification ? 'notification' : 'normal'}_${todo?.nodeid}_${todo?.id}`}
      />
    </Todo>
  )
}

export default NotificationTodo

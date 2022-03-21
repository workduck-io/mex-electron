import { AppType } from '../../hooks/useInitialize'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import React, { useState } from 'react'
import { PriorityType, TodoStatus, TodoType } from '../../editor/Components/Todo/types'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import Todo, { TodoControls } from '../../ui/components/Todo'
import { IpcAction } from '../../data/IpcAction'

interface NotificationTodoProps {
  todo: TodoType
  dismissNotification: () => void
}

const NotificationTodo = ({ todo, dismissNotification }: NotificationTodoProps) => {
  const [localTodo, setLocalTodo] = useState(todo)
  const controls: TodoControls = {
    onChangeStatus: (todoid: string, status: TodoStatus) => {
      console.log('change status', todoid, status)
      const newTodo = { ...localTodo, metadata: { ...localTodo.metadata, status } }
      setLocalTodo(newTodo)
      appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, { type: 'todo', todoAction: 'status', value: newTodo })
    },
    onChangePriority: (todoid: string, priority: PriorityType) => {
      console.log('change priority', todoid, priority)
      const newTodo = { ...localTodo, metadata: { ...localTodo.metadata, priority } }
      appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, {
        type: 'todo',
        todoAction: 'priority',
        value: newTodo
      })
      setLocalTodo(newTodo)
    },
    getTodo: (parentNodeId: string, todoId: string) => {
      console.log('getTodo', parentNodeId, todoId)
      return localTodo
    }
  }
  return (
    <Todo showDelete={false} parentNodeId={todo.nodeid} todoid={todo.id} controls={controls} readOnly>
      <EditorPreviewRenderer
        noStyle
        content={todo.content}
        editorId={`NoticationTodoPreview_${todo.nodeid}_${todo.id}_${todo.metadata.status}`}
      />
    </Todo>
  )
}

export default NotificationTodo

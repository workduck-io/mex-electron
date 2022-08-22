import { useTodoBuffer } from '@hooks/useTodoBuffer'
import useTodoBufferStore from '@hooks/useTodoBufferStore'
import { mog } from '@utils/lib/helper'
import React, { useEffect, useMemo, useState } from 'react'
import { getNextStatus, PriorityDataType, PriorityType, TodoStatus, TodoType } from '../../editor/Components/Todo/types'
// import { useReminders } from '../../hooks/useReminders'
// import { getPureContent } from '../../hooks/useTodoKanban'
import { MexIcon } from '../../style/Layouts'
// import { mog } from '../../utils/lib/helper'
// import { convertContentToRawText } from '../../utils/search/parseData'
import PrioritySelect from './Priority/PrioritySelect'
import { CheckBoxWrapper, StyledTodoStatus, TodoContainer, TodoOptions, TodoText } from './Todo.style'
// import TodoCheck from './TodoCheck'
// import TodoReminder from './TodoReminder'

export interface TodoControls {
  onDeleteClick?: (todoid: string) => void
  onChangeStatus?: (todoid: string, status: TodoStatus) => void
  onChangePriority?: (todoid: string, priority: PriorityType) => void
  getTodo?: (parentNodeId: string, todoId: string) => TodoType
}

interface TodoProps {
  parentNodeId: string
  todoid: string
  oid?: string
  controls?: TodoControls
  children?: React.ReactNode
  readOnly?: boolean
  showDelete?: boolean
}

const Todo = ({ parentNodeId, todoid, children, readOnly, oid, controls, showDelete = true }: TodoProps) => {
  const [showOptions, setShowOptions] = useState(false)

  const [animate, setAnimate] = useState(false)

  const { getNoteTodo: getTodoFromStore, updateNoteTodo } = useTodoBuffer()
  const todosBuffer = useTodoBufferStore((store) => store.todosBuffer)

  const todo = useMemo(() => {
    return controls && controls.getTodo
      ? controls.getTodo(parentNodeId, todoid)
      : getTodoFromStore(parentNodeId, todoid)
  }, [parentNodeId, todoid, animate, todosBuffer])

  useEffect(() => {
    if (animate) setAnimate(false)
  }, [animate])

  const onPriorityChange = (priority: PriorityDataType) => {
    if (controls && controls.onChangePriority) controls.onChangePriority(todoid, priority.type)
    else
      updateNoteTodo(parentNodeId, todoid, {
        entityMetadata: { priority: priority.type, status: todo.entityMetadata?.status || TodoStatus.todo }
      })
    setAnimate(true)
  }

  const changeStatus = () => {
    if (controls && controls.onChangeStatus) controls.onChangeStatus(todoid, getNextStatus(todo.entityMetadata?.status))
    else {
      mog("CHANGE STATUS", { parentNodeId, todoid, entityMetadata: {
          priority: todo.entityMetadata?.priority || PriorityType.noPriority,
          status: getNextStatus(todo.entityMetadata?.status)
        } })

      updateNoteTodo(parentNodeId, todoid, {
        entityMetadata: {
          priority: todo.entityMetadata?.priority || PriorityType.noPriority,
          status: getNextStatus(todo.entityMetadata?.status)
        }
      })
    }
      
    setAnimate(true)
  }

  return (
    <TodoContainer
      key={`BasicTodo_${todo?.nodeid}_${todo?.entityId}_${oid}`}
      id={`BasicTodo_${todo?.nodeid}_${todo?.entityId}_${oid}`}
      checked={todo?.entityMetadata?.status === TodoStatus.completed}
      onMouseEnter={() => {
        setShowOptions(true)
      }}
      onMouseLeave={() => setShowOptions(false)}
    >
      <CheckBoxWrapper id={`TodoStatusFor_${todo?.entityId}_${oid}`} contentEditable={false}>
        <StyledTodoStatus
          animate={animate}
          status={todo?.entityMetadata?.status || TodoStatus.todo}
          onClick={changeStatus}
        />
      </CheckBoxWrapper>

      <TodoText contentEditable={!readOnly} suppressContentEditableWarning>
        {children}
      </TodoText>
      <TodoOptions id={`TodoOptionsFor_${oid}_${todoid}`} contentEditable={false}>
        {showOptions && showDelete && (
          <MexIcon
            onClick={() => {
              controls.onDeleteClick && controls.onDeleteClick(todo?.entityId)
            }}
            icon="codicon:trash"
            cursor="pointer"
            margin="0"
            fontSize={20}
          />
        )}
        {(showOptions || todo?.entityMetadata?.priority !== PriorityType.noPriority) && (
          <PrioritySelect
            value={todo?.entityMetadata?.priority || PriorityType.noPriority}
            onPriorityChange={onPriorityChange}
            id={todo?.entityId}
          />
        )}
      </TodoOptions>
    </TodoContainer>
  )
}

export default Todo

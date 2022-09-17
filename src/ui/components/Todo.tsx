import { useTodoBuffer } from '@hooks/useTodoBuffer'
import useTodoBufferStore from '@hooks/useTodoBufferStore'
import { mog } from '@utils/lib/helper'
import React, { useEffect, useMemo, useState } from 'react'
import { getNextStatus, PriorityDataType, PriorityType, TodoStatus, TodoType } from '../../editor/Components/Todo/types'
<<<<<<< Updated upstream
// import { useReminders } from '../../hooks/useReminders'
// import { getPureContent } from '../../hooks/useTodoKanban'
<<<<<<< Updated upstream
=======
import useTodoStore from '../../store/useTodoStore'
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
import { MexIcon } from '../../style/Layouts'
import PrioritySelect from './Priority/PrioritySelect'
import { CheckBoxWrapper, StyledTodoStatus, TodoContainer, TodoOptions, TodoText } from './Todo.style'

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

<<<<<<< Updated upstream
const Todo = ({ parentNodeId, todoid, children, readOnly, oid, controls, showDelete = true }: TodoProps) => {
  const [showOptions, setShowOptions] = useState(false)
=======
const Todo = React.forwardRef<any, TodoProps>((props, ref) => {
  const { parentNodeId, todoid, children, readOnly, oid, controls, showDelete = true } = props
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    if (controls && controls.onChangeStatus) controls.onChangeStatus(todoid, getNextStatus(todo.entityMetadata?.status))
    else {
      mog("CHANGE STATUS", { parentNodeId, todoid, entityMetadata: {
          priority: todo.entityMetadata?.priority || PriorityType.noPriority,
          status: getNextStatus(todo.entityMetadata?.status)
        } })
=======
<<<<<<< Updated upstream
    if (controls && controls.onChangeStatus) controls.onChangeStatus(todoid, getNextStatus(todo.metadata.status))
    else updateStatus(parentNodeId, todoid, getNextStatus(todo.metadata.status))
=======
    if (controls && controls.onChangeStatus) controls.onChangeStatus(todoid, getNextStatus(todo.entityMetadata?.status))
    else {
      mog("CHANGE STATUS", {
        parentNodeId, todoid, entityMetadata: {
          priority: todo.entityMetadata?.priority || PriorityType.noPriority,
          status: getNextStatus(todo.entityMetadata?.status)
        }
      })
>>>>>>> Stashed changes

      updateNoteTodo(parentNodeId, todoid, {
        entityMetadata: {
          priority: todo.entityMetadata?.priority || PriorityType.noPriority,
          status: getNextStatus(todo.entityMetadata?.status)
        }
      })
    }
<<<<<<< Updated upstream
      
=======

>>>>>>> Stashed changes
>>>>>>> Stashed changes
    setAnimate(true)
  }

  return (
    <TodoContainer
<<<<<<< Updated upstream
      key={`BasicTodo_${todo?.nodeid}_${todo?.entityId}_${oid}`}
      id={`BasicTodo_${todo?.nodeid}_${todo?.entityId}_${oid}`}
      checked={todo?.entityMetadata?.status === TodoStatus.completed}
=======
<<<<<<< Updated upstream
      key={`BasicTodo_${todo.nodeid}_${todo.id}_${oid}`}
      id={`BasicTodo_${todo.nodeid}_${todo.id}_${oid}`}
      checked={todo?.metadata.status === TodoStatus.completed}
=======
      ref={ref}
      key={`BasicTodo_${todo?.nodeid}_${todo?.entityId}_${oid}`}
      id={`BasicTodo_${todo?.nodeid}_${todo?.entityId}_${oid}`}
      checked={todo?.entityMetadata?.status === TodoStatus.completed}
>>>>>>> Stashed changes
>>>>>>> Stashed changes
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
})

export default Todo

import React, { useEffect, useState } from 'react'
import { getNextStatus, PriorityDataType, PriorityType, TodoStatus } from '../../editor/Components/Todo/types'
import useTodoStore from '../../store/useTodoStore'
import { MexIcon } from '../../style/Layouts'
import { mog } from '../../utils/lib/helper'
import PrioritySelect from './Priority/PrioritySelect'
import { CheckBoxWrapper, StyledTodoStatus, TodoContainer, TodoOptions, TodoText } from './Todo.style'

interface TodoProps {
  parentNodeId: string
  todoid: string
  onDeleteClick?: (todoid: string) => void
  children?: React.ReactNode
  readOnly?: boolean
  showDelete?: boolean
}

const Todo = ({ parentNodeId, todoid, children, readOnly, onDeleteClick, showDelete = true }: TodoProps) => {
  const [showOptions, setShowOptions] = useState(false)

  const [animate, setAnimate] = useState(false)

  const updateTodo = useTodoStore((store) => store.updateTodoOfNode)
  const getTodo = useTodoStore((store) => store.getTodoOfNode)
  const todo = getTodo(parentNodeId, todoid)

  useEffect(() => {
    if (animate) setAnimate(false)
  }, [animate])

  const onPriorityChange = (priority: PriorityDataType) => {
    updateTodo(parentNodeId, { ...todo, metadata: { ...todo.metadata, priority: priority.type } })
    setAnimate(true)
  }

  const changeStatus = () => {
    updateTodo(parentNodeId, { ...todo, metadata: { ...todo.metadata, status: getNextStatus(todo.metadata.status) } })
    mog('TodoUpdate', {
      ...todo,
      metadata: { ...todo.metadata, status: getNextStatus(todo.metadata.status) }
    })
    setAnimate(true)
  }

  return (
    <TodoContainer
      key={`BasicTodo_${todo.nodeid}_${todo.id}`}
      checked={todo?.metadata.status === TodoStatus.completed}
      onMouseEnter={() => {
        setShowOptions(true)
      }}
      onMouseLeave={() => setShowOptions(false)}
    >
      <CheckBoxWrapper contentEditable={false}>
        <StyledTodoStatus animate={animate} status={todo.metadata.status} onClick={changeStatus} />
      </CheckBoxWrapper>
      <TodoText contentEditable={!readOnly} suppressContentEditableWarning>
        {children}
      </TodoText>
      {(showOptions || todo.metadata.priority !== PriorityType.noPriority) && (
        <TodoOptions contentEditable={false}>
          {showOptions && showDelete && (
            <MexIcon
              onClick={() => onDeleteClick(todo.id)}
              icon="codicon:trash"
              cursor="pointer"
              margin="0"
              fontSize={20}
            />
          )}
          <PrioritySelect value={todo.metadata.priority} onPriorityChange={onPriorityChange} id={todo.id} />
          {/* <TaskPriority background="#114a9e" transparent={0.25}>
            assignee
          </TaskPriority> */}
        </TodoOptions>
      )}
    </TodoContainer>
  )
}

export default Todo

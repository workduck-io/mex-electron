import React, { useEffect, useState } from 'react'
import { getNextStatus, PriorityDataType, PriorityType, TodoStatus, TodoType } from '../../editor/Components/Todo/types'
import { useReminders } from '../../hooks/useReminders'
import useTodoStore from '../../store/useTodoStore'
import { MexIcon } from '../../style/Layouts'
import { mog } from '../../utils/lib/helper'
import { convertContentToRawText } from '../../utils/search/parseData'
import PrioritySelect from './Priority/PrioritySelect'
import { CheckBoxWrapper, StyledTodoStatus, TodoContainer, TodoOptions, TodoText } from './Todo.style'
import TodoReminder from './TodoReminder'

export interface TodoControls {
  onDeleteClick?: (todoid: string) => void
  onChangeStatus?: (todoid: string, status: TodoStatus) => void
  onChangePriority?: (todoid: string, priority: PriorityType) => void
  getTodo?: (parentNodeId: string, todoId: string) => TodoType
}

interface TodoProps {
  parentNodeId: string
  todoid: string
  controls?: TodoControls
  children?: React.ReactNode
  readOnly?: boolean
  showDelete?: boolean
}

const Todo = ({ parentNodeId, todoid, children, readOnly, controls, showDelete = true }: TodoProps) => {
  // mog('Todo', { parentNodeId, todoid, readOnly })
  const [showOptions, setShowOptions] = useState(false)

  const [animate, setAnimate] = useState(false)

  const updatePriority = useTodoStore((store) => store.updatePriorityOfTodo)
  const updateStatus = useTodoStore((store) => store.updateStatusOfTodo)
  const getTodoFromStore = useTodoStore((store) => store.getTodoOfNode)
  const todo = controls.getTodo ? controls.getTodo(parentNodeId, todoid) : getTodoFromStore(parentNodeId, todoid)

  const { getBlockReminder } = useReminders()
  const reminder = getBlockReminder(todoid)

  useEffect(() => {
    if (animate) setAnimate(false)
  }, [animate])

  const onPriorityChange = (priority: PriorityDataType) => {
    if (controls.onChangePriority) controls.onChangePriority(todoid, priority.type)
    else updatePriority(parentNodeId, todoid, priority.type)
    setAnimate(true)
  }

  const changeStatus = () => {
    if (controls.onChangeStatus) controls.onChangeStatus(todoid, getNextStatus(todo.metadata.status))
    else updateStatus(parentNodeId, todoid, getNextStatus(todo.metadata.status))
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
      <TodoOptions contentEditable={false}>
        {showOptions && showDelete && (
          <MexIcon
            onClick={() => controls.onDeleteClick && controls.onDeleteClick(todo.id)}
            icon="codicon:trash"
            cursor="pointer"
            margin="0"
            fontSize={20}
          />
        )}
        {(showOptions || (reminder && !reminder.state.done)) && (
          <TodoReminder
            id={todo.id}
            todoid={todo.id}
            nodeid={parentNodeId}
            content={convertContentToRawText(todo.content, ' ')}
          />
        )}
        {(showOptions || todo.metadata.priority !== PriorityType.noPriority) && (
          <PrioritySelect value={todo.metadata.priority} onPriorityChange={onPriorityChange} id={todo.id} />
        )}
        {/* <TaskPriority background="#114a9e" transparent={0.25}>
            assignee
          </TaskPriority> */}
      </TodoOptions>
    </TodoContainer>
  )
}

export default Todo

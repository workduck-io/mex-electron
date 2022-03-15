import React, { useEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'
import { useReadOnly } from 'slate-react'
import { useTheme } from 'styled-components'
import PriorityMenu from '../../editor/Components/Todo/PriorityMenu'
import { Priority, PriorityDataType, PriorityType, TodoStatus, TodoType } from '../../editor/Components/Todo/types'
import useTodoStore from '../../store/useTodoStore'
import { MexIcon } from '../../style/Layouts'
import { mog } from '../../utils/lib/helper'
import {
  CheckBoxWrapper,
  PriorityButton,
  StyledTodoStatus,
  TaskPriority,
  TodoContainer,
  TodoOptions,
  TodoText
} from './Todo.style'

interface TodoProps {
  parentNodeId: string
  todoid: string
  onDeleteClick?: (todoid: string) => void
  children?: React.ReactNode
  readOnly?: boolean
}

const Todo = ({ parentNodeId, todoid, children, readOnly, onDeleteClick }: TodoProps) => {
  const [showOptions, setShowOptions] = useState(false)

  const theme = useTheme()

  const [animate, setAnimate] = useState(false)

  const updateTodo = useTodoStore((store) => store.updateTodoOfNode)
  const getTodo = useTodoStore((store) => store.getTodoOfNode)

  const { show } = useContextMenu({ id: todoid })

  const todo = getTodo(parentNodeId, todoid)

  useEffect(() => {
    if (animate) setAnimate(false)
  }, [animate])

  const onPriorityChange = (priority: PriorityDataType) => {
    updateTodo(parentNodeId, { ...todo, metadata: { ...todo.metadata, priority: priority.type } })
    setAnimate(true)
  }

  const changeStatus = () => {
    let status = todo.metadata.status

    switch (todo.metadata.status) {
      case TodoStatus.todo:
        status = TodoStatus.pending
        break
      case TodoStatus.pending:
        status = TodoStatus.completed
        break
      default:
        status = TodoStatus.todo
        break
    }
    updateTodo(parentNodeId, { ...todo, metadata: { ...todo.metadata, status } })
    mog('TodoUpdate', {
      ...todo,
      metadata: { ...todo.metadata, status }
    })
    setAnimate(true)
  }

  mog('Todo', {
    todo,
    readOnly
  })

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
          <TaskPriority onClick={show} background={theme.colors.secondary} transparent={0.8}>
            <PriorityButton background={theme.colors.background.card}>
              <MexIcon
                onClick={show}
                icon={Priority[todo?.metadata?.priority]?.icon}
                margin="0 0.5rem 0 0"
                fontSize={20}
                cursor="pointer"
                color={theme.colors.primary}
              />
              <div>{Priority[todo?.metadata.priority]?.title}</div>
            </PriorityButton>
          </TaskPriority>
          {/* <TaskPriority background="#114a9e" transparent={0.25}>
            assignee
          </TaskPriority> */}
          {showOptions && (
            <MexIcon
              onClick={() => onDeleteClick(todo.id)}
              icon="codicon:trash"
              cursor="pointer"
              margin="0"
              fontSize={20}
              color={theme.colors.primary}
            />
          )}
        </TodoOptions>
      )}
      <PriorityMenu id={todo.id} onClick={onPriorityChange} />
    </TodoContainer>
  )
}

export default Todo

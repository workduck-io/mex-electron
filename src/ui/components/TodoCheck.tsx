import React, { useMemo } from 'react'
import { TodoType } from '../../editor/Components/Todo/types'
import useTodoStore from '../../store/useTodoStore'
import { CheckBoxWrapper, StyledTodoStatus } from './Todo.style'

interface TodoCheckProps {
  oid?: string
  animate?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  todo: TodoType
}

const TodoCheck = ({ onClick, animate, oid, todo }: TodoCheckProps) => {
  const getTodo = useTodoStore((store) => store.getTodoOfNodeWithoutCreating)
  const todos = useTodoStore((store) => store.todos)

  const status = useMemo(() => {
    const utodo = getTodo(todo.nodeid, todo.id)
    return utodo ? utodo.metadata.status : todo.metadata.status
  }, [todos])

  return (
    <CheckBoxWrapper id={`TodoStatusFor_${todo.id}_${oid}`} contentEditable={false}>
      <StyledTodoStatus animate={animate} status={status} onClick={onClick} />
    </CheckBoxWrapper>
  )
}

export default TodoCheck

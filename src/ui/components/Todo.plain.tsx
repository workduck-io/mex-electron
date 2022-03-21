import React from 'react'
import { getNextStatus, PriorityDataType, TodoType } from '../../editor/Components/Todo/types'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import { getPureContent } from '../../hooks/useTodoKanban'
import { convertContentToRawText } from '../../utils/search/parseData'
import { TodoControls } from './Todo'
import { CheckBoxWrapper, StyledTodoStatus, TodoContainer } from './Todo.style'

interface TodoPlainProps {
  todo: TodoType
  controls?: TodoControls
  oid?: string
}

const TodoPlain = ({ todo, oid, controls }: TodoPlainProps) => {
  const onClick = () => {
    if (controls && controls.onChangeStatus) controls.onChangeStatus(todo.id, getNextStatus(todo.metadata.status))
    console.log('clicked')
  }

  // const onPriorityChange = (priority: PriorityDataType) => {
  //   if (controls && controls.onChangePriority) controls.onChangePriority(todo.id, priority.type)
  // }

  return (
    <TodoContainer>
      <CheckBoxWrapper id={`TodoStatusFor_${todo.id}_${oid}`} contentEditable={false}>
        <StyledTodoStatus animate={true} status={todo.metadata.status} onClick={onClick} />
      </CheckBoxWrapper>
      {convertContentToRawText(todo.content)}
    </TodoContainer>
  )
}

export default TodoPlain

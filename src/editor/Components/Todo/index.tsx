import React, { useEffect, useState } from 'react'
import { ReactEditor, useReadOnly } from 'slate-react'
import { TElement, setNodes } from '@udecode/plate-core'
import styled, { css, useTheme } from 'styled-components'

import { MexIcon } from '../../../style/Layouts'
import { TodoListItemNodeData } from '@udecode/plate-list'
import { getRootProps } from '@udecode/plate-styled-components'
import { transparentize } from 'polished'
import useTodoStore from '../../../store/useTodoStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { Priority, PriorityDataType, TodoStatus } from './types'
import { mog } from '../../../utils/lib/helper'
import PriorityMenu from './PriorityMenu'
import { useContextMenu } from 'react-contexify'

const TodoContainer = styled.div<{ checked?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  ${({ theme, checked }) =>
    checked &&
    css`
      color: ${theme.colors.gray[5]};
      text-decoration: line-through;
    `}
`

const TaskPriority = styled.span<{ background: string; color?: string; transparent?: number }>`
  padding: 4px;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 400;
  background-color: ${({ transparent, background }) =>
    transparent ? transparentize(transparent, background) : background};
  color: ${({ color, theme }) => color ?? theme.colors.text.default};
  margin-right: 0.5rem;
`

const PriorityButton = styled.div<{ background: string }>`
  padding: 2px 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 1rem;
  :hover {
    background-color: ${({ background }) => background};
  }
`

const TodoOptions = styled.span`
  position: absolute;
  right: 0;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`

const CheckBoxWrapper = styled.div`
  display: flex;
  margin-right: 0.5rem;
  user-select: none;
  justify-content: center;
  align-items: center;

  input {
    margin: 0;
    width: 1rem;
    height: 1rem;
  }
`

const TodoText = styled.span`
  flex: 1;
  :focus {
    outline: none;
  }
`

const Todo = (props: any) => {
  const { attributes, children, element, editor } = props
  const [showOptions, setShowOptions] = useState(false)
  const theme = useTheme()

  const rootProps = getRootProps(props)

  const readOnly = useReadOnly()
  const nodeid = useEditorStore((store) => store.node.nodeid)

  const getTodo = useTodoStore((store) => store.getTodo)
  const updateTodo = useTodoStore((store) => store.updateTodo)

  const todo = getTodo(element.id, nodeid)

  const { show } = useContextMenu({ id: todo.id })

  const onPriorityChange = (priority: PriorityDataType) => {
    updateTodo({ ...todo, metadata: { ...todo.metadata, priority: priority.type } })
  }

  return (
    <TodoContainer
      {...attributes}
      {...rootProps}
      key={todo?.id}
      checked={todo?.metadata.status !== TodoStatus.todo}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <CheckBoxWrapper contentEditable={false}>
        <input
          id={todo?.id}
          key={todo?.id}
          data-testid="TodoListElementCheckbox"
          type="checkbox"
          checked={todo?.metadata.status !== TodoStatus.todo}
          onChange={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const path = ReactEditor.findPath(editor, element)

            if (todo) {
              updateTodo({
                ...todo,
                metadata: { ...todo.metadata, status: e.target.checked ? TodoStatus.completed : TodoStatus.todo }
              })
            }

            setNodes<TElement<TodoListItemNodeData>>(
              editor,
              { checked: e.target.checked },
              {
                at: path
              }
            )
          }}
        />
      </CheckBoxWrapper>
      <TodoText contentEditable={!readOnly} suppressContentEditableWarning>
        {children}
      </TodoText>
      {showOptions && (
        <TodoOptions contentEditable={false}>
          {/* <TaskPriority onClick={show} background={theme.colors.secondary} transparent={0.8}> */}
          {/* <PriorityButton background={theme.colors.background.card}> */}
          <MexIcon
            onClick={show}
            icon={Priority[todo?.metadata?.priority]?.icon}
            margin="0 0.5rem 0 0"
            fontSize={24}
            cursor="pointer"
            color={theme.colors.primary}
          />
          {/* <div>{todo?.metadata.priority.toUpperCase()}</div> */}
          {/* </PriorityButton> */}
          {/* </TaskPriority> */}
          {/* <TaskPriority background="#114a9e" transparent={0.25}>
            assignee
          </TaskPriority> */}
          <MexIcon icon="codicon:trash" cursor="pointer" margin="0" fontSize={24} color={theme.colors.primary} />
        </TodoOptions>
      )}
      <PriorityMenu id={todo.id} onClick={onPriorityChange} />
    </TodoContainer>
  )
}

export default Todo

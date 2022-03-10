import React, { useEffect, useState } from 'react'
import { useReadOnly } from 'slate-react'
import styled, { css, useTheme } from 'styled-components'

import { MexIcon } from '../../../style/Layouts'
import { getRootProps } from '@udecode/plate-styled-components'
import { transparentize } from 'polished'
import useTodoStore from '../../../store/useTodoStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { Priority, PriorityDataType, TodoStatus } from './types'
import PriorityMenu from './PriorityMenu'
import { useContextMenu } from 'react-contexify'
import { CompleteWave, WaterWave } from '../../../components/mex/Onboarding/components/Welcome'
import { getNodes, getPlateEditorRef } from '@udecode/plate'
import { Transforms } from 'slate'
import toast from 'react-hot-toast'

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
  padding: 2px;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 400;
  background-color: ${({ transparent, background }) =>
    transparent ? transparentize(transparent, background) : background};
  color: ${({ color, theme }) => color ?? theme.colors.text.default};
  margin-right: 0.5rem;
`

const PriorityButton = styled.div<{ background: string }>`
  padding: 1px 0.4rem;
  display: flex;
  align-items: center;
  border-radius: 1rem;
  :hover {
    background-color: ${({ background }) => background};
  }
`

const StyledTodoStatus = styled.div<{ animate?: boolean; status: TodoStatus }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 1rem;
  width: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  margin-right: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.text.fade};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${(props) => props.theme.colors.background.highlight};
  overflow: hidden;

  ::before {
    content: '';
    position: absolute;
    border-radius: 40%;
    background-color: ${({ theme }) => theme.colors.primary};

    ${(props) => {
      switch (props.status) {
        case TodoStatus.todo:
          return css`
            transform: translateY(1.2rem);
          `
        case TodoStatus.pending:
          return props.animate
            ? css`
                animation: ${WaterWave} 0.25s ease-out;
                animation-fill-mode: forwards;
              `
            : css`
                transform: translateY(0.6rem) rotateZ(0deg);
              `
        case TodoStatus.completed:
          return props.animate
            ? css`
                animation: ${CompleteWave} 0.25s ease-out;
              `
            : css`
                transform: translateY(0rem) rotateZ(0deg);
              `
      }
    }}

    width: 1.2rem;
    height: 1.2rem;
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
  const { attributes, children, element } = props
  const [showOptions, setShowOptions] = useState(false)
  const theme = useTheme()

  const rootProps = getRootProps(props)

  const readOnly = useReadOnly()
  const [animate, setAnimate] = useState(false)
  const nodeid = useEditorStore((store) => store.node.nodeid)

  const getTodo = useTodoStore((store) => store.getTodoOfNode)
  const updateTodo = useTodoStore((store) => store.updateTodoOfNode)

  const todo = getTodo(nodeid, element.id)

  const { show } = useContextMenu({ id: todo.id })

  useEffect(() => {
    setAnimate(false)
  }, [])

  const onPriorityChange = (priority: PriorityDataType) => {
    updateTodo(nodeid, { ...todo, metadata: { ...todo.metadata, priority: priority.type } })
  }

  const onDeleteClick = () => {
    const editor = getPlateEditorRef()
    const blockNode = getNodes(editor, {
      at: [],
      match: (node) => todo.id === node.id,
      block: true
    })
    try {
      const [_, path] = Array.from(blockNode)[0]
      Transforms.delete(editor, { at: [path[0]] })
      editor.insertText('')
    } catch (error) {
      toast('Unable to delete this todo')
    }
  }

  const changeStatus = () => {
    let status = todo.metadata.status
    setAnimate(true)
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

    updateTodo(nodeid, { ...todo, metadata: { ...todo.metadata, status } })
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
        <StyledTodoStatus animate={animate} status={todo.metadata.status} onClick={changeStatus} />
      </CheckBoxWrapper>
      <TodoText contentEditable={!readOnly} suppressContentEditableWarning>
        {children}
      </TodoText>
      {showOptions && (
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
              <div>{todo?.metadata.priority.toUpperCase()}</div>
            </PriorityButton>
          </TaskPriority>
          {/* <TaskPriority background="#114a9e" transparent={0.25}>
            assignee
          </TaskPriority> */}
          <MexIcon
            onClick={onDeleteClick}
            icon="codicon:trash"
            cursor="pointer"
            margin="0"
            fontSize={20}
            color={theme.colors.primary}
          />
        </TodoOptions>
      )}
      <PriorityMenu id={todo.id} onClick={onPriorityChange} />
    </TodoContainer>
  )
}

export default Todo

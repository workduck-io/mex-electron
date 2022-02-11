import React, { useState } from 'react'
import { setNodes, TElement } from '@udecode/plate-core'
import { TodoListItemNodeData } from '@udecode/plate-list'
import { getRootProps } from '@udecode/plate-styled-components'
import { ReactEditor, useReadOnly } from 'slate-react'
import styled, { useTheme } from 'styled-components'
import { MexIcon } from '../../../style/Layouts'
import { transparentize } from 'polished'

const TodoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`

const TaskPriority = styled.span<{ background: string; color?: string; transparent?: number }>`
  padding: 2px 0.75rem;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 400;
  background-color: ${({ transparent, background }) =>
    transparent ? transparentize(transparent, background) : background};
  color: ${({ color, theme }) => color ?? theme.colors.text.default};
  margin-right: 0.5rem;
`

const TodoOptions = styled.span`
  position: absolute;
  right: 0;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  /* background-color: ${(props) => props.theme.colors.background.highlight}; */
  /* padding: 1rem; */
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
  const { attributes, children, nodeProps, element, editor } = props
  const [showOptions, setShowOptions] = useState(false)
  const theme = useTheme()

  const rootProps = getRootProps(props)

  const readOnly = useReadOnly()

  const { checked } = element

  return (
    <TodoContainer
      {...attributes}
      {...rootProps}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <CheckBoxWrapper contentEditable={false}>
        <input
          data-testid="TodoListElementCheckbox"
          type="checkbox"
          checked={!!checked}
          onChange={(e) => {
            const path = ReactEditor.findPath(editor, element)

            setNodes<TElement<TodoListItemNodeData>>(
              editor,
              { checked: e.target.checked },
              {
                at: path
              }
            )
          }}
          {...nodeProps}
        />
      </CheckBoxWrapper>
      <TodoText contentEditable={!readOnly} suppressContentEditableWarning>
        {children}
      </TodoText>
      {showOptions && (
        <TodoOptions contentEditable={false}>
          <TaskPriority background={theme.colors.secondary} transparent={0.8}>
            high
          </TaskPriority>
          <TaskPriority background="#114a9e" transparent={0.25}>
            assignee
          </TaskPriority>
          <MexIcon icon="codicon:trash" margin="0" fontSize={24} color={theme.colors.primary} />
        </TodoOptions>
      )}
    </TodoContainer>
  )
}

export default Todo

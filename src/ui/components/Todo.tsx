import React, { useEffect, useMemo, useState } from 'react'

import { useTodoBuffer } from '@hooks/useTodoBuffer'
import useTodoBufferStore from '@hooks/useTodoBufferStore'

import { getNextStatus, PriorityDataType, PriorityType, TodoStatus, TodoType } from '../../editor/Components/Todo/types'
import { MexIcon } from '../../style/Layouts'
import PrioritySelect from './Priority/PrioritySelect'
import { CheckBoxWrapper, StyledTodoStatus, TodoContainer, TodoOptions, TodoText } from './Todo.style'
import useEntityAPIs from '@hooks/useEntityAPIs'
import { getPlateEditorRef, setNodes } from '@udecode/plate'
import useTodoStore from '@store/useTodoStore'
import { mog } from '@workduck-io/mex-utils'

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
  children?: any
  readOnly?: boolean
  showDelete?: boolean
  withAPI?: boolean
}

const Todo = React.forwardRef<any, TodoProps>((props, ref) => {
  const { parentNodeId, todoid, children, readOnly, oid, controls, showDelete = true } = props

  const [showOptions, setShowOptions] = useState(false)
  const [animate, setAnimate] = useState(false)

  const { getNoteTodos } = useEntityAPIs()
  const { getNoteTodo: getTodoFromStore, updateNoteTodo } = useTodoBuffer()
  const isFetchingTasks = useTodoBufferStore((store) => store.isFetching)
  const setIsFetchingTasks = useTodoBufferStore((store) => store.setIsFetching)
  const todosBuffer = useTodoBufferStore((store) => store.todosBuffer)
  const todos = useTodoStore.getState().todos?.[parentNodeId]

  const todo = useMemo(() => {
    const isTodoPresent = controls && controls.getTodo

    if (isTodoPresent) {
      return controls.getTodo(parentNodeId, todoid)
    }

    const storedTodo = getTodoFromStore(parentNodeId, todoid)

    return storedTodo
  }, [parentNodeId, todoid, animate, todosBuffer])

  useEffect(() => {
    const existingTodo = todos?.find((t) => t.entityId === todoid)

    const hasChildren = children?.[0]?.props?.text?.text === ''

    if (existingTodo?.entityId) {
      const editor = getPlateEditorRef(parentNodeId)
      mog('Existing Todo', { existingTodo, editor })
      if (editor)
        setNodes(editor, existingTodo.content[0], {
          at: [],
          match: (n) => {
            return n?.entityId === existingTodo.entityId
          }
        })
    } else if (hasChildren) {
      if (!useTodoBufferStore.getState().isFetching) {
        setIsFetchingTasks(true)
        mog('CALLING API!!!')
        getNoteTodos(parentNodeId)
          .then(() => setIsFetchingTasks(false))
          .catch((er) => setIsFetchingTasks(false))
      }
    }
  }, [todoid, todos])

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
      $loading={isFetchingTasks}
      key={`BasicTodo_${todo?.nodeid}_${todo?.entityId}_${oid}`}
      id={`BasicTodo_${todo?.nodeid}_${todo?.entityId}_${oid}`}
      checked={todo?.entityMetadata?.status === TodoStatus.completed}
      onMouseEnter={() => {
        setShowOptions(true)
      }}
      ref={ref}
      onMouseLeave={() => setShowOptions(false)}
    >
      {!isFetchingTasks && (
        <CheckBoxWrapper id={`TodoStatusFor_${todo?.entityId}_${oid}`} contentEditable={false}>
          <StyledTodoStatus
            animate={animate}
            status={todo?.entityMetadata?.status || TodoStatus.todo}
            onClick={changeStatus}
          />
        </CheckBoxWrapper>
      )}

      <TodoText contentEditable={!readOnly && !isFetchingTasks} suppressContentEditableWarning>
        {children}
      </TodoText>
      {!isFetchingTasks && (
        <>
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
        </>
      )}
    </TodoContainer>
  )
})

Todo.displayName = 'Todo'

export default Todo

import Board from '@asseinfo/react-kanban'
import trashIcon from '@iconify/icons-codicon/trash'
import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Heading } from '../../components/spotlight/SearchResults/styled'
import { SNIPPET_PREFIX } from '../../data/Defaults/idPrefixes'
import { TodoType } from '../../editor/Components/Todo/types'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import { useLinks } from '../../hooks/useLinks'
import { useTodoKanban } from '../../hooks/useTodoKanban'
import useTodoStore from '../../store/useTodoStore'
import { Button } from '../../style/Buttons'
import { Title } from '../../style/Integration'
import { MainHeader, PageContainer } from '../../style/Layouts'
import { StyledTasksKanban } from '../../style/Todo'
import Todo from '../../ui/components/Todo'
import { mog } from '../../utils/lib/helper'
import { convertContentToRawText } from '../../utils/search/localSearch'

export type TasksProps = {
  title?: string
}

type TaskGroupProp = {
  nodeid: string
  todos: Array<TodoType>
}

const NodeHeading = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
`

const TaskContainer = styled.section`
  padding: 2rem;
  margin-bottom: 1rem;
`

const TaskGroup: React.FC<TaskGroupProp> = ({ nodeid, todos }) => {
  const { getPathFromNodeid } = useLinks()
  // const { push } = useNavigation()
  // const { goTo } = useRouting()

  // const onClick = (nodeid: string) => {
  //   push(nodeid)
  //   appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)

  //   goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  // }

  // mog('TaskGroup', { nodeid, todos })
  return (
    <TaskContainer>
      <NodeHeading>{getPathFromNodeid(nodeid) ?? nodeid}</NodeHeading>
      {todos.map((todo) => (
        <Todo key={`${nodeid}_${todo.id}`} todoid={todo.id} readOnly parentNodeId={nodeid}>
          {convertContentToRawText(todo.content, '\n')}
          <p>
            Nodeid: {todo.nodeid}
            todo: {todo.id}
            status: {todo.metadata.status}
          </p>
        </Todo>
      ))}
    </TaskContainer>
  )
}

const Tasks: React.FC<TasksProps> = () => {
  const nodesTodo = useTodoStore((store) => store.todos)
  const clearTodos = useTodoStore((store) => store.clearTodos)

  const todos = useMemo(() => Object.entries(nodesTodo), [nodesTodo])

  const { getTodoBoard, changeStatus, getPureContent } = useTodoKanban()

  const board = useMemo(() => getTodoBoard(), [nodesTodo])

  const handleCardMove = (card, source, destination) => {
    mog('card moved', { card, source, destination })
    changeStatus(card.todo, destination.toColumnId)
    // const updatedBoard = moveCard(controlledBoard, source, destination);
    // setBoard(updatedBoard);
  }

  const onClearClick = () => {
    clearTodos()
  }

  mog('Tasks', { nodesTodo, board })

  return (
    <PageContainer>
      <MainHeader>
        <Title>Todos</Title>
        <Button onClick={onClearClick}>
          <Icon icon={trashIcon} height={24} />
          Clear Todos
        </Button>
      </MainHeader>
      <StyledTasksKanban>
        <Board
          renderColumnHeader={({ title }) => <div>{title}</div>}
          disableColumnDrag
          onCardDragEnd={handleCardMove}
          renderCard={({ id, todo }) => {
            const pC = getPureContent(todo)
            // mog('RenderTodo', { id, todo })
            return (
              <div>
                <Todo
                  key={`TODO_PREVIEW_${todo.nodeid}_${todo.id}`}
                  todoid={todo.id}
                  readOnly
                  parentNodeId={todo.nodeid}
                >
                  <EditorPreviewRenderer
                    noStyle
                    content={pC}
                    editorId={`NodeTodoPreview_${todo.nodeid}_${todo.id}_${todo.metadata.status}`}
                  />
                </Todo>
              </div>
            )
          }}
        >
          {board}
        </Board>
      </StyledTasksKanban>
      <div>
        {todos.length > 0 ? (
          todos.map(([nodeid, todos]) => {
            if (nodeid.startsWith(SNIPPET_PREFIX)) return null
            return <TaskGroup key={nodeid} nodeid={nodeid} todos={todos} />
          })
        ) : (
          <div>
            <Heading>No Todos</Heading>
            <p>Use the Editor to add Todos to your nodes. All todos will show up here.</p>
            <p>
              You can add todos with
              <kbd>[]</kbd>
            </p>
            {/* HTML element for keyboard shortcut */}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

export default Tasks

import React from 'react'
import { ColumnContainer } from '../../components/spotlight/Actions/styled'
import useTodoStore from '../../store/useTodoStore'
import taskFill from '@iconify-icons/ri/task-fill'
import { IntegrationContainer, Text, Title } from '../../style/Integration'
import styled, { useTheme } from 'styled-components'
import { useNavigation } from '../../hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'
import { IpcAction } from '../../data/IpcAction'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import { AppType } from '../../hooks/useInitialize'
import { TodoStatus, TodoType } from '../../editor/Components/Todo/types'
import { useLinks } from '../../hooks/useLinks'
import { transparentize } from 'polished'
import { MexIcon } from '../../style/Layouts'
import { Heading } from '../../components/spotlight/SearchResults/styled'
import { DateFormat } from '../../hooks/useRelativeTime'
import { convertContentToRawText } from '../../utils/search/localSearch'

export type TasksProps = {
  title?: string
}

const Task = styled.div`
  display: flex;
  padding: 1rem 2rem;
  cursor: pointer;
  margin: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background.card};
`

type TaskGroupProp = {
  nodeid: string
  todos: Array<TodoType>
}

const FlexIt = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  span {
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    margin-right: 2rem;
    font-size: 1.1rem;
    background-color: ${({ theme }) => theme.colors.background.card};
    :hover {
      background-color: ${({ theme }) => transparentize(0.2, theme.colors.primary)};
    }
  }
`

const NodeHeading = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
`

const TaskContainer = styled.section`
  padding: 2rem;
  margin-bottom: 1rem;
`

const TaskGroup: React.FC<TaskGroupProp> = ({ nodeid, todos }) => {
  const { getNodeIdFromUid } = useLinks()
  const { push } = useNavigation()
  const { goTo } = useRouting()

  const onClick = (nodeid: string) => {
    push(nodeid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)

    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const theme = useTheme()

  return (
    <TaskContainer>
      <NodeHeading>{getNodeIdFromUid(nodeid) ?? nodeid}</NodeHeading>
      {todos.map((todo) => (
        <Task key={todo.id} onClick={() => onClick(todo.nodeid)}>
          <FlexIt>
            <>
              <MexIcon
                margin="0 1rem 0 0"
                color={todo.metadata.status === TodoStatus.completed ? theme.colors.primary : theme.colors.secondary}
                fontSize={24}
                icon={taskFill}
              />
              <Text>{convertContentToRawText(todo.content, '\n')}</Text>
            </>
          </FlexIt>
        </Task>
      ))}
    </TaskContainer>
  )
}

const Tasks: React.FC<TasksProps> = () => {
  const nodesTodo = useTodoStore((store) => store.todos)
  const clearTodos = useTodoStore((store) => store.clearTodos)

  const onClearClick = () => {
    clearTodos()
  }

  return (
    <IntegrationContainer>
      <FlexIt>
        <Title>Todos</Title>
        <span onClick={onClearClick}>Clear</span>
      </FlexIt>
      <ColumnContainer>
        {Object.entries(nodesTodo).map(([nodeid, todos]) => {
          return <TaskGroup key={nodeid} nodeid={nodeid} todos={todos} />
        })}
      </ColumnContainer>
    </IntegrationContainer>
  )
}

export default Tasks

import React from 'react'
import { ColumnContainer } from '../../components/spotlight/Actions/styled'
import useTodoStore from '../../store/useTodoStore'
import taskFill from '@iconify-icons/ri/task-fill'
import { IntegrationContainer, Text, Title } from '../../style/Integration'
import styled from 'styled-components'
import { convertContentToRawText } from '../../utils/search/localSearch'
import { Icon } from '@iconify/react'
import { useNavigation } from '../../hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'
import { IpcAction } from '../../data/IpcAction'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import { AppType } from '../../hooks/useInitialize'

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

const Tasks: React.FC<TasksProps> = () => {
  const todos = useTodoStore((store) => store.todos)
  const { push } = useNavigation()
  const { goTo } = useRouting()

  const onClick = (nodeid: string) => {
    push(nodeid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)

    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  return (
    <IntegrationContainer>
      <Title>Todos</Title>
      <ColumnContainer>
        {todos.map((todo) => (
          <Task key={todo.id} onClick={() => onClick(todo.nodeid)}>
            <Icon fontSize={24} icon={taskFill} />
            <Text>{convertContentToRawText(todo.content, '\n')}</Text>
          </Task>
        ))}
      </ColumnContainer>
    </IntegrationContainer>
  )
}

export default Tasks

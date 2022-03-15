import Board from '@asseinfo/react-kanban'
import trashIcon from '@iconify/icons-codicon/trash'
import { Icon } from '@iconify/react'
import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import tinykeys from 'tinykeys'
import { Heading } from '../../components/spotlight/SearchResults/styled'
import { SNIPPET_PREFIX } from '../../data/Defaults/idPrefixes'
import {
  getNextStatus,
  getPrevStatus,
  PriorityDataType,
  PriorityType,
  TodoType
} from '../../editor/Components/Todo/types'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import { useLinks } from '../../hooks/useLinks'
import useLoad from '../../hooks/useLoad'
import { KanbanBoardColumn, TodoKanbanCard, useTodoKanban } from '../../hooks/useTodoKanban'
import useDataStore from '../../store/useDataStore'
import { useEditorStore } from '../../store/useEditorStore'
import { useRecentsStore } from '../../store/useRecentsStore'
import useTodoStore from '../../store/useTodoStore'
import { Button } from '../../style/Buttons'
import { Title } from '../../style/Integration'
import { MainHeader, PageContainer } from '../../style/Layouts'
import { StyledTasksKanban, TaskCard, TaskColumnHeader } from '../../style/Todo'
import Todo from '../../ui/components/Todo'
import { mog } from '../../utils/lib/helper'
import { convertContentToRawText } from '../../utils/search/localSearch'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'

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
        </Todo>
      ))}
    </TaskContainer>
  )
}

const Tasks: React.FC<TasksProps> = () => {
  const [selectedCard, setSelectedCard] = React.useState<TodoKanbanCard | null>(null)
  const nodesTodo = useTodoStore((store) => store.todos)
  const clearTodos = useTodoStore((store) => store.clearTodos)

  const { loadNode } = useLoad()
  const { goTo } = useRouting()

  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const nodeUID = useEditorStore((store) => store.node.nodeid)
  const baseNodeId = useDataStore((store) => store.baseNodeId)

  const todos = useMemo(() => Object.entries(nodesTodo), [nodesTodo])

  const { getTodoBoard, changeStatus, changePriority, getPureContent } = useTodoKanban()

  const board = useMemo(() => getTodoBoard(), [nodesTodo])

  const handleCardMove = (card, source, destination) => {
    // mog('card moved', { card, source, destination })
    changeStatus(card.todo, destination.toColumnId)
  }

  const onClearClick = () => {
    clearTodos()
  }

  const selectFirst = () => {
    const firstCardColumn = board.columns.find((column) => column.cards.length > 0)
    // mog('firstCard', { selectedCard, board, firstCardColumn })
    if (firstCardColumn) {
      const firstCard = firstCardColumn.cards[0]
      setSelectedCard(firstCard)
    }
  }

  const handleCardMoveNext = () => {
    if (!selectedCard) return
    const newStatus = getNextStatus(selectedCard.todo.metadata.status)
    changeStatus(selectedCard.todo, newStatus)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, metadata: { ...selectedCard.todo.metadata, status: newStatus } }
    })
  }

  const handleCardMovePrev = () => {
    if (!selectedCard) return
    const newStatus = getPrevStatus(selectedCard.todo.metadata.status)
    // mog('new status', { newStatus, selectedCard })
    changeStatus(selectedCard.todo, newStatus)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, metadata: { ...selectedCard.todo.metadata, status: newStatus } }
    })
  }

  const changeSelectedPriority = (priority: PriorityType) => {
    if (!selectedCard) return
    changePriority(selectedCard.todo, priority)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, metadata: { ...selectedCard.todo.metadata, priority } }
    })
  }

  const selectDown = () => {
    if (!selectedCard) {
      selectFirst()
      return
    }
    const selectedColumn = board.columns.find(
      (column) => column.id === selectedCard.todo.metadata.status
    ) as KanbanBoardColumn
    const selectedColumnLength = selectedColumn.cards.length
    const selectedIndex = selectedColumn.cards.findIndex((card) => card.id === selectedCard.id)
    const nextCard = selectedColumn.cards[(selectedIndex + 1) % selectedColumnLength]
    // mog('nextCard', { nextCard, selectedColumn, selectedColumnLength, selectedIndex })
    if (nextCard) {
      setSelectedCard(nextCard)
    }
  }

  const selectUp = () => {
    if (!selectedCard) {
      selectFirst()
      return
    }
    const selectedColumn = board.columns.find(
      (column) => column.id === selectedCard.todo.metadata.status
    ) as KanbanBoardColumn
    const selectedColumnLength = selectedColumn.cards.length
    const selectedIndex = selectedColumn.cards.findIndex((card) => card.id === selectedCard.id)
    const prevCard = selectedColumn.cards[(selectedIndex - 1 + selectedColumnLength) % selectedColumnLength]
    // mog('prevCard', { prevCard })

    if (prevCard) {
      setSelectedCard(prevCard)
    }
  }
  const selectRight = () => {
    if (!selectedCard) {
      selectFirst()
      return
    }
    const selectedColumn = board.columns.find(
      (column) => column.id === selectedCard.todo.metadata.status
    ) as KanbanBoardColumn
    let selectedColumnStatus = selectedColumn.id
    const selectedIndex = selectedColumn.cards.findIndex((card) => card.id === selectedCard.id)
    let nextCard = undefined
    // mog('nextCardRight', { nextCard, selectedColumn, selectedColumnStatus, selectedIndex })
    while (!nextCard) {
      const nextColumn = board.columns.find(
        (column) => column.id === getNextStatus(selectedColumnStatus)
      ) as KanbanBoardColumn
      if (!nextColumn) break
      nextCard = nextColumn.cards[selectedIndex % nextColumn.cards.length]
      selectedColumnStatus = nextColumn.id
    }
    if (nextCard) {
      setSelectedCard(nextCard)
    }
  }

  const selectLeft = () => {
    if (!selectedCard) {
      selectFirst()
      return
    }
    const selectedColumn = board.columns.find(
      (column) => column.id === selectedCard.todo.metadata.status
    ) as KanbanBoardColumn
    let selectedColumnStatus = selectedColumn.id
    const selectedIndex = selectedColumn.cards.findIndex((card) => card.id === selectedCard.id)
    let prevCard = undefined
    while (!prevCard) {
      const prevColumn = board.columns.find(
        (column) => column.id === getPrevStatus(selectedColumnStatus)
      ) as KanbanBoardColumn
      if (!prevColumn || prevColumn.id === selectedColumn.id) break
      prevCard = prevColumn.cards[selectedIndex % prevColumn.cards.length]
      selectedColumnStatus = prevColumn.id
    }
    if (prevCard) {
      setSelectedCard(prevCard)
    }
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        if (selectedCard) {
          setSelectedCard(null)
        } else {
          const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
          loadNode(nodeid)
          goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
        }
      },
      Tab: (event) => {
        event.preventDefault()
        // Blur the input if necessary (not needed currently)
        // if (inputRef.current) inputRef.current.blur()
        if (event.shiftKey) {
          selectUp()
        } else {
          selectDown()
        }
      },
      'Shift+ArrowRight': (event) => {
        event.preventDefault()
        handleCardMoveNext()
      },
      'Shift+ArrowLeft': (event) => {
        event.preventDefault()
        handleCardMovePrev()
      },
      ArrowRight: (event) => {
        event.preventDefault()
        selectRight()
      },
      ArrowLeft: (event) => {
        event.preventDefault()
        if (event.shiftKey) {
          handleCardMovePrev()
        } else {
          selectLeft()
        }
      },
      ArrowDown: (event) => {
        event.preventDefault()
        selectDown()
      },

      ArrowUp: (event) => {
        event.preventDefault()
        selectUp()
      },

      '$mod+1': (event) => {
        event.preventDefault()
        changeSelectedPriority(PriorityType.low)
      },
      '$mod+2': (event) => {
        event.preventDefault()
        changeSelectedPriority(PriorityType.medium)
      },
      '$mod+3': (event) => {
        event.preventDefault()
        changeSelectedPriority(PriorityType.high)
      },
      '$mod+0': (event) => {
        event.preventDefault()
        changeSelectedPriority(PriorityType.noPriority)
      },

      Enter: (event) => {
        // Only when the selected index is -1
        if (selectedCard !== null) {
          event.preventDefault()
          handleCardMoveNext()
          mog('enter', { selectedCard })
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [board, selectedCard])

  // mog('Tasks', { nodesTodo, board, selectedCard })

  const RenderCard = ({ id, todo }: { id: string; todo: TodoType }, { dragging }: { dragging: boolean }) => {
    const pC = getPureContent(todo)
    // mog('RenderTodo', { id, todo, dragging })
    return (
      <TaskCard selected={selectedCard && selectedCard.id === id} dragging={dragging}>
        <Todo key={`TODO_PREVIEW_${todo.nodeid}_${todo.id}`} todoid={todo.id} readOnly parentNodeId={todo.nodeid}>
          <EditorPreviewRenderer
            noStyle
            content={pC}
            editorId={`NodeTodoPreview_${todo.nodeid}_${todo.id}_${todo.metadata.status}`}
          />
        </Todo>
      </TaskCard>
    )
  }

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
          renderColumnHeader={({ title }) => <TaskColumnHeader>{title}</TaskColumnHeader>}
          disableColumnDrag
          onCardDragEnd={handleCardMove}
          renderCard={RenderCard}
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

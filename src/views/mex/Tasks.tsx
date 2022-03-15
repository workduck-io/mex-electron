import Board from '@asseinfo/react-kanban'
import trashIcon from '@iconify/icons-codicon/trash'
import { Icon } from '@iconify/react'
import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import tinykeys from 'tinykeys'
import { Heading } from '../../components/spotlight/SearchResults/styled'
import { IpcAction } from '../../data/IpcAction'
import { getNextStatus, getPrevStatus, PriorityType, TodoType } from '../../editor/Components/Todo/types'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import { AppType } from '../../hooks/useInitialize'
import { useLinks } from '../../hooks/useLinks'
import useLoad from '../../hooks/useLoad'
import { useNavigation } from '../../hooks/useNavigation'
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

const Tasks = () => {
  const [selectedCard, setSelectedCard] = React.useState<TodoKanbanCard | null>(null)
  const nodesTodo = useTodoStore((store) => store.todos)
  const clearTodos = useTodoStore((store) => store.clearTodos)

  const { loadNode } = useLoad()
  const { goTo } = useRouting()

  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const nodeUID = useEditorStore((store) => store.node.nodeid)
  const baseNodeId = useDataStore((store) => store.baseNodeId)

  const { push } = useNavigation()

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

  const onNavigateToNode = () => {
    if (!selectedCard) {
      return
    }
    const nodeid = selectedCard.todo.nodeid
    push(nodeid)
    appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const selectFirst = () => {
    const firstCardColumn = board.columns.find((column) => column.cards.length > 0)
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

  const selectNewCard = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCard) {
      selectFirst()
      return
    }
    const selectedColumn = board.columns.find(
      (column) => column.id === selectedCard.todo.metadata.status
    ) as KanbanBoardColumn
    const selectedColumnLength = selectedColumn.cards.length
    const selectedIndex = selectedColumn.cards.findIndex((card) => card.id === selectedCard.id)

    // mog('selected card', { selectedCard, selectedColumn, selectedColumnLength, selectedIndex, direction })

    switch (direction) {
      case 'up': {
        const prevCard = selectedColumn.cards[(selectedIndex - 1 + selectedColumnLength) % selectedColumnLength]
        // mog('prevCard', { prevCard })

        if (prevCard) {
          // mog('selected card', { selectedCard, prevCard })
          setSelectedCard(prevCard)
        }
        break
      }
      case 'down': {
        const nextCard = selectedColumn.cards[(selectedIndex + 1) % selectedColumnLength]
        // mog('nextCard', { nextCard, selectedColumn, selectedColumnLength, selectedIndex })
        if (nextCard) {
          // mog('selected card', { selectedCard, nextCard })
          setSelectedCard(nextCard)
        }
        break
      }
      case 'left': {
        let selectedColumnStatus = selectedColumn.id
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
          // mog('selected card', { selectedCard, prevCard })
          setSelectedCard(prevCard)
        }
        break
      }
      case 'right': {
        let selectedColumnStatus = selectedColumn.id
        let nextCard = undefined
        while (!nextCard) {
          const nextColumn = board.columns.find(
            (column) => column.id === getNextStatus(selectedColumnStatus)
          ) as KanbanBoardColumn
          if (!nextColumn || nextColumn.id === selectedColumn.id) break
          nextCard = nextColumn.cards[selectedIndex % nextColumn.cards.length]
          selectedColumnStatus = nextColumn.id
        }
        if (nextCard) {
          // mog('selected card', { selectedCard, nextCard })
          setSelectedCard(nextCard)
        }
        break
      }
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
        selectNewCard('right')
      },
      ArrowLeft: (event) => {
        event.preventDefault()
        selectNewCard('left')
      },
      ArrowDown: (event) => {
        event.preventDefault()
        selectNewCard('down')
      },

      ArrowUp: (event) => {
        event.preventDefault()
        selectNewCard('up')
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

      'Shift+Enter': (event) => {
        event.preventDefault()
        onNavigateToNode()
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
      {todos.length < 1 && (
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
    </PageContainer>
  )
}

export default Tasks

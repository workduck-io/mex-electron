import React, { useEffect, useMemo, useRef } from 'react'

import Board from '@asseinfo/react-kanban'
import TaskEditor from '@components/mex/Tasks/TaskEditor'
import TaskHeader from '@components/mex/Tasks/TaskHeader'
import { useEnableShortcutHandler } from '@hooks/useShortcutListener'
import { useSyncTaskViews, useViewStore } from '@hooks/useTaskViews'
import { useTodoBuffer } from '@hooks/useTodoBuffer'
import useTodoBufferStore from '@hooks/useTodoBufferStore'
import useMultipleEditors from '@store/useEditorsStore'
import { useLayoutStore } from '@store/useLayoutStore'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { OverlaySidebarWindowWidth } from '@style/responsive'
import { ErrorBoundary } from 'react-error-boundary'
import { useMediaQuery } from 'react-responsive'
import { useMatch } from 'react-router-dom'

import { convertContentToRawText, ELEMENT_MENTION, mog, NodeEditorContent } from '@workduck-io/mex-utils'
import { tinykeys } from '@workduck-io/tinykeys'

import SearchFilters from '../../../components/mex/Search/SearchFilters'
import { Heading } from '../../../components/spotlight/SearchResults/styled'
import { getNextStatus, getPrevStatus, PriorityType, TodoType } from '../../../editor/Components/Todo/types'
import { useNavigation } from '../../../hooks/useNavigation'
import { KanbanBoardColumn, TodoKanbanCard, useTodoKanban } from '../../../hooks/useTodoKanban'
import useTodoStore from '../../../store/useTodoStore'
import { PageContainer } from '../../../style/Layouts'
import { StyledTasksKanban, TaskCard } from '../../../style/Todo'
import Todo from '../../../ui/components/Todo'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../routes/urls'
import ColumnHeader from './ColumnHeader'

const StringifiedContent = ({ content }: { content: NodeEditorContent }) => {
  const contentString = convertContentToRawText(content, ' ', { exclude: { types: new Set([ELEMENT_MENTION]) } })

  return <>{contentString}</>
}

const Tasks = () => {
  const [selectedCard, setSelectedCard] = React.useState<TodoKanbanCard | null>(null)
  const nodesTodo = useTodoStore((store) => store.todos)
  const clearTodos = useTodoStore((store) => store.clearTodos)
  const todosInBuffer = useTodoBufferStore((store) => store.todosBuffer)
  const sidebar = useLayoutStore((store) => store.sidebar)
  const match = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const currentView = useViewStore((store) => store.currentView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { enableShortcutHandler } = useEnableShortcutHandler()
  const isModalOpen = useModalStore((store) => store.open)

  const { goTo } = useRouting()

  // * Todo Buffer hook
  const { getNoteTodo } = useTodoBuffer()
  const setTodoModalData = useModalStore((store) => store.setData)
  const toggleModal = useModalStore((store) => store.toggleOpen)

  const { push } = useNavigation()

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  const {
    getTodoBoard,
    changeStatus,
    changePriority,
    getPureContent,
    addCurrentFilter,
    changeCurrentFilter,
    removeCurrentFilter,
    resetCurrentFilters,
    setCurrentFilters,
    filters,
    currentFilters,
    globalJoin,
    setGlobalJoin
  } = useTodoKanban()

  const { todoBoard: board, todosLength } = useMemo(
    () => getTodoBoard(),
    [nodesTodo, todosInBuffer, globalJoin, currentFilters]
  )

  const selectedRef = useRef<HTMLDivElement>(null)

  const isPreviewEditors = useMultipleEditors((store) => store.editors)
  const handleCardMove = (card, source, destination) => {
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
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const selectFirst = () => {
    const firstCardColumn = board.columns.find((column) => column.cards.length > 0)
    if (firstCardColumn) {
      if (firstCardColumn.cards) {
        const firstCard = firstCardColumn.cards[0]
        setSelectedCard(firstCard)
      }
    }
  }

  const handleCardMoveNext = () => {
    if (!selectedCard) return
    const newStatus = getNextStatus(selectedCard.todo.entityMetadata.status)
    changeStatus(selectedCard.todo, newStatus)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, entityMetadata: { ...selectedCard.todo.entityMetadata, status: newStatus } }
    })
  }

  const handleCardMovePrev = () => {
    if (!selectedCard) return
    const newStatus = getPrevStatus(selectedCard.todo.entityMetadata.status)
    // mog('new status', { newStatus, selectedCard })
    changeStatus(selectedCard.todo, newStatus)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, entityMetadata: { ...selectedCard.todo.entityMetadata, status: newStatus } }
    })
  }

  const changeSelectedPriority = (priority: PriorityType) => {
    if (!selectedCard) return
    changePriority(selectedCard.todo, priority)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, entityMetadata: { ...selectedCard.todo.entityMetadata, priority } }
    })
  }

  const selectNewCard = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCard) {
      selectFirst()
      return
    }

    const selectedColumn = board.columns.find(
      (column) => column.id === selectedCard.todo.entityMetadata.status
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

  // Fetch all task views
  useSyncTaskViews()

  useEffect(() => {
    if (selectedRef.current) {
      const el = selectedRef.current
      // is element in viewport
      const rect = el.getBoundingClientRect()
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

      // mog('scroll to selected', { selected, top, isInViewport, rect })
      if (!isInViewport) {
        selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [selectedCard])

  useEffect(() => {
    const shorcutConfig = () => {
      mog('CALLED!!', { isModalOpen })
      if (isModalOpen !== undefined) return {}

      return {
        Escape: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            if (selectedCard) {
              setSelectedCard(null)
            }
            // else {
            // mog('LOAD NODE')
            // // const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
            // // loadNode(nodeid)
            // // goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
            // }
          })
        },

        'Shift+ArrowRight': (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            handleCardMoveNext()
          })
        },

        'Shift+ArrowLeft': (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            handleCardMovePrev()
          })
        },

        ArrowRight: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            selectNewCard('right')
          })
        },

        ArrowLeft: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            selectNewCard('left')
          })
        },
        ArrowDown: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            selectNewCard('down')
          })
        },

        ArrowUp: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            selectNewCard('up')
          })
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

        '$mod+Enter': (event) => {
          event.preventDefault()
          onNavigateToNode()
        }
      }
    }

    if (!isPreviewEditors || (isPreviewEditors && !Object.entries(isPreviewEditors).length)) {
      const unsubscribe = tinykeys(window, shorcutConfig())

      return () => {
        unsubscribe()
      }
    }
  }, [board, selectedCard, isModalOpen, isPreviewEditors])

  useEffect(() => {
    if (match && match.params && match.params.viewid) {
      // const viewid = match.params.viewid
      // loadView(viewid)
      if (currentView) {
        setCurrentFilters(currentView.filters)
        setGlobalJoin(currentView.globalJoin)
      }
      // goTo(ROUTE_PATHS.view, NavigationType.push, viewid)
    } else {
      setCurrentView(undefined)
      setCurrentFilters([])
    }
  }, [match])

  const onDoubleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, nodeId: string, entityId: string) => {
    event.preventDefault()
    //double click
    // mog('double click', { event })
    if (event.detail === 2) {
      const todo = getNoteTodo(nodeId, entityId)
      if (todo) {
        setTodoModalData(todo)
        toggleModal(ModalsType.todo)
      }
    }
  }

  const RenderCard = ({ id, todo }: { id: string; todo: TodoType }, { dragging }: { dragging: boolean }) => {
    const todos = useTodoStore((store) => store.todos)
    const pC = useMemo(() => getPureContent(todo), [id, todos])
    const toggleModal = useModalStore((store) => store.toggleOpen)

    mog(`Task for ${todo.entityId}`, { pC })

    return (
      <TaskCard
        ref={selectedCard && id === selectedCard.id ? selectedRef : null}
        key={id}
        selected={selectedCard && selectedCard.id === id}
        dragging={dragging}
        sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}
        onMouseDown={(event) => {
          event.preventDefault()
          if (event.detail === 2) {
            toggleModal(ModalsType.previewNote, { noteId: todo.nodeid, blockId: todo.id })
          }
        }}
      >
        <Todo
          showDelete={false}
          key={`TODO_PREVIEW_${todo.nodeid}_${todo.entityId}`}
          todoid={todo.entityId}
          readOnly
          parentNodeId={todo.nodeid}
        >
          <ErrorBoundary fallback={<StringifiedContent content={pC} />}>
            <TaskEditor
              readOnly
              content={pC}
              editorId={`${todo.nodeid}_TASK_${todo.entityId}_${todo.entityMetadata.status}`}
            />
          </ErrorBoundary>
        </Todo>
      </TaskCard>
    )
  }

  return (
    <PageContainer>
      <StyledTasksKanban sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}>
        <TaskHeader
          currentFilters={currentFilters}
          cardSelected={!!selectedCard}
          currentView={currentView}
          globalJoin={globalJoin}
        />
        <SearchFilters
          result={board}
          addCurrentFilter={addCurrentFilter}
          removeCurrentFilter={removeCurrentFilter}
          changeCurrentFilter={changeCurrentFilter}
          resetCurrentFilters={resetCurrentFilters}
          filters={filters}
          currentFilters={currentFilters}
          globalJoin={globalJoin}
          setGlobalJoin={setGlobalJoin}
        />
        <Board
          renderColumnHeader={ColumnHeader}
          disableColumnDrag
          onCardDragEnd={handleCardMove}
          renderCard={RenderCard}
        >
          {board}
        </Board>
      </StyledTasksKanban>
      {todosLength < 1 && (
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

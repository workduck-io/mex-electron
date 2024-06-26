import React, { useEffect, useMemo, useRef } from 'react'

import Board from '@asseinfo/react-kanban'
import TaskHeader from '@components/mex/Tasks/TaskHeader'
import { useEnableShortcutHandler } from '@hooks/useShortcutListener'
import { useSyncTaskViews, useViewStore } from '@hooks/useTaskViews'
import { useLayoutStore } from '@store/useLayoutStore'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { OverlaySidebarWindowWidth } from '@style/responsive'
import { useMediaQuery } from 'react-responsive'
import { useMatch } from 'react-router-dom'

import { tinykeys } from '@workduck-io/tinykeys'

import SearchFilters from '../../components/mex/Search/SearchFilters'
import { Heading } from '../../components/spotlight/SearchResults/styled'
import { getNextStatus, getPrevStatus, PriorityType, TodoType } from '../../editor/Components/Todo/types'
import { useNavigation } from '../../hooks/useNavigation'
import { KanbanBoardColumn, TodoKanbanCard, useTodoKanban } from '../../hooks/useTodoKanban'
import useTodoStore from '../../store/useTodoStore'
import { PageContainer } from '../../style/Layouts'
import { StyledTasksKanban, TaskCard, TaskColumnHeader } from '../../style/Todo'
import Todo from '../../ui/components/Todo'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'
import Plateless from '@editor/Plateless'
import { isReadonly, usePermissions } from '@hooks/usePermissions'
import toast from 'react-hot-toast'
import { useBlockHighlightStore, useFocusBlock } from '@editor/Actions/useFocusBlock'
import useMultipleEditors from '@store/useEditorsStore'

interface RenderTaskProps {
  id: string
  todo: TodoType
  selectedRef: React.RefObject<HTMLDivElement>
  selectedCard: TodoKanbanCard | null
  overlaySidebar: boolean
  dragging: boolean
}

export const RenderTask = React.memo<RenderTaskProps>(
  ({ id, overlaySidebar, todo, selectedCard, selectedRef, dragging }: RenderTaskProps) => {
    const { changeStatus, changePriority, getPureContent } = useTodoKanban()

    const sidebar = useLayoutStore((store) => store.sidebar)
    const { selectBlock } = useFocusBlock()
    const setHighlights = useBlockHighlightStore((state) => state.setHighlightedBlockIds)
    const todos = useTodoStore((store) => store.todos)
    const pC = useMemo(() => getPureContent(todo), [id, todo])
    const { accessWhenShared } = usePermissions()
    const readOnly = useMemo(() => isReadonly(accessWhenShared(todo?.nodeid)), [todo])

    const controls = useMemo(
      () => ({
        onChangePriority: (todoId: string, priority) => {
          changePriority(todo, priority)
        },
        onChangeStatus: (todoId: string, status) => {
          changeStatus(todo, status)
        }
      }),
      []
    )

    const toggleModal = useModalStore((store) => store.toggleOpen)
    const priorityShown = todo.metadata.priority !== PriorityType.noPriority

    

    return (
      <TaskCard
        ref={selectedCard && id === selectedCard.id ? selectedRef : null}
        selected={selectedCard && selectedCard.id === id}
        dragging={dragging}
        sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}
        priorityShown={priorityShown}
        onMouseDown={(event) => {
          event.preventDefault()
          if (event.detail === 2) {
            // toggleModal(ModalsType.previewNote, { noteId: todo.nodeid, blockId: todo.id })
            selectBlock(todo.id)
            setHighlights([todo.id], 'editor')
            toggleModal(ModalsType.previewNote, { noteId: todo.nodeid, blockId: todo.id })
          }
        }}
      >
        <Todo
          showDelete={false}
          key={`TODO_PREVIEW_${todo.nodeid}_${todo.id}`}
          todoid={todo.id}
          readOnly={readOnly}
          readOnlyContent
          showPriority
          controls={controls}
          parentNodeId={todo.nodeid}
        >
          {/*
          <EditorPreviewRenderer
            noStyle
            content={pC}
            editorId={`NodeTodoPreview_${todo.nodeid}_${todo.id}_${todo.metadata.status}`}
          /> */}
          <Plateless content={pC} />
        </Todo>
      </TaskCard>
    )
  }
)

RenderTask.displayName= 'RenderTask'

const Tasks = () => {
  const [selectedCard, setSelectedCard] = React.useState<TodoKanbanCard | null>(null)
  const nodesTodo = useTodoStore((store) => store.todos)
  const clearTodos = useTodoStore((store) => store.clearTodos)
  const sidebar = useLayoutStore((store) => store.sidebar)
  const match = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const currentView = useViewStore((store) => store.currentView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { enableShortcutHandler } = useEnableShortcutHandler()
  const { accessWhenShared } = usePermissions()
  const isModalOpen = useModalStore((store) => store.open)

  const { goTo } = useRouting()

  const { push } = useNavigation()

  const todos = useMemo(() => Object.entries(nodesTodo), [nodesTodo])

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  const {
    getTodoBoard,
    changeStatus,
    changePriority,
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

  const board = useMemo(() => getTodoBoard(), [nodesTodo, globalJoin, currentFilters])
  const { selectBlock } = useFocusBlock()
  const setHighlights = useBlockHighlightStore((state) => state.setHighlightedBlockIds)
  const selectedRef = useRef<HTMLDivElement>(null)
  const isPreviewEditors = useMultipleEditors((store) => store.editors)
  const handleCardMove = (card, source, destination) => {
    const readOnly = card?.todo?.nodeid && isReadonly(accessWhenShared(card?.todo?.nodeid))
    // mog('card moved', { card, source, destination, readOnly })
    if (!readOnly) {
      changeStatus(card.todo, destination.toColumnId)
    } else {
      toast('Cannot move task in a note with Read only permission')
    }
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

  const RenderCard = ({ id, todo }: { id: string; todo: TodoType }, { dragging }: { dragging: boolean }) => {
    return (
      <RenderTask
        id={id}
        todo={todo}
        selectedRef={selectedRef}
        selectedCard={selectedCard}
        overlaySidebar={overlaySidebar}
        dragging={dragging}
      />
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

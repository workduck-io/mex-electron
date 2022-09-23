import checkboxLine from '@iconify/icons-ri/checkbox-line'
import { useTaskViewModalStore } from '@components/mex/TaskViewModal'
import stackLine from '@iconify/icons-ri/stack-line'
import { TasksHelp } from '@data/Defaults/helpText'
import { SearchFilter } from '@hooks/useFilters'
import { useTaskViews, useViewStore, View } from '@hooks/useTaskViews'
import trashIcon from '@iconify/icons-codicon/trash'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import arrowLeftRightLine from '@iconify/icons-ri/arrow-left-right-line'
import dragMove2Fill from '@iconify/icons-ri/drag-move-2-fill'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import { Icon } from '@iconify/react'
import {
  ShortcutToken,
  ShortcutTokens,
  TaskHeader as StyledTaskHeader,
  TaskHeaderIcon,
  TaskHeaderTitleSection,
  TaskViewControls,
  TaskViewHeaderWrapper,
  TaskViewTitle
} from '@style/Todo'
// import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'
import { Title } from '@style/Typography'
import { useSingleton } from '@tippyjs/react'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useMemo, useState } from 'react'
import {
  Button,
  IconButton,
  Infobox,
  ToolbarTooltip,
  DisplayShortcut,
  LoadingButton
} from '@workduck-io/mex-components'

interface TaskHeaderProps {
  currentView?: View<any>
  currentFilters: SearchFilter[]
  cardSelected: boolean
}

const TaskHeader = ({ currentView, currentFilters, cardSelected }: TaskHeaderProps) => {
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { deleteView } = useTaskViews()

  const { goTo } = useRouting()

  const [source, target] = useSingleton()
  const [deleting, setDeleting] = useState(false)

  const isCurrentFiltersUnchanged = useMemo(() => {
    return JSON.stringify(currentFilters) === JSON.stringify(currentView?.filters)
  }, [currentFilters, currentView])

  const onDeleteView = async () => {
    if (currentView) {
      setDeleting(true)
      await deleteView(currentView.id)
      setDeleting(false)
      setCurrentView(undefined)
      goTo(ROUTE_PATHS.tasks, NavigationType.push)
    }
  }

  return (
    <StyledTaskHeader>
      <TaskHeaderTitleSection>
        <ToolbarTooltip singleton={source} />
        <TaskHeaderIcon>
          <Icon icon={checkboxLine} />
        </TaskHeaderIcon>
        {currentView ? (
          <>
            <TaskViewHeaderWrapper>
              <TaskViewTitle>
                <Icon icon={stackLine} />
                {currentView?.title}
                {!isCurrentFiltersUnchanged && '*'}
              </TaskViewTitle>
              <TaskViewControls>
                <Button
                  onClick={() =>
                    openTaskViewModal({
                      filters: currentFilters,
                      updateViewId: currentView?.id
                    })
                  }
                  disabled={currentFilters.length === 0}
                  primary={!isCurrentFiltersUnchanged && currentFilters.length > 0}
                >
                  <Icon icon={edit2Line} />
                  Update View
                </Button>
                <IconButton
                  title="Clone View"
                  onClick={() => openTaskViewModal({ filters: currentView?.filters, cloneViewId: currentView?.id })}
                  disabled={currentFilters.length === 0}
                  singleton={target}
                  icon={fileCopyLine}
                  transparent={false}
                />
                <LoadingButton
                  title="Delete View"
                  loading={deleting}
                  onClick={() => onDeleteView()}
                  singleton={target}
                  transparent={false}
                >
                  <Icon icon={trashIcon} />
                </LoadingButton>
                <IconButton
                  title="Create New View"
                  onClick={() => openTaskViewModal({ filters: currentFilters, cloneViewId: currentView?.id })}
                  disabled={currentFilters.length === 0}
                  singleton={target}
                  transparent={false}
                  icon={addCircleLine}
                />
              </TaskViewControls>
            </TaskViewHeaderWrapper>
          </>
        ) : (
          <>
            <Title>Tasks</Title>
            <Button
              onClick={() => openTaskViewModal({ filters: currentFilters, cloneViewId: currentView?.id })}
              disabled={currentFilters.length === 0}
            >
              <Icon icon={addCircleLine} />
              Create View
            </Button>
          </>
        )}
      </TaskHeaderTitleSection>
      <ShortcutTokens>
        <ShortcutToken>
          Select:
          <Icon icon={dragMove2Fill} />
        </ShortcutToken>
        {cardSelected && (
          <>
            <ShortcutToken>
              Navigate:
              <DisplayShortcut shortcut="$mod+Enter" />
            </ShortcutToken>
            <ShortcutToken>
              Move:
              <DisplayShortcut shortcut="Shift" />
              <Icon icon={arrowLeftRightLine} />
            </ShortcutToken>
            <ShortcutToken>
              Change Priority:
              <DisplayShortcut shortcut="$mod+0-3" />
            </ShortcutToken>
          </>
        )}
        <ShortcutToken>
          {cardSelected || currentFilters.length > 0 ? 'Clear Filters:' : 'Navigate to Editor:'}
          <DisplayShortcut shortcut="Esc" />
        </ShortcutToken>
      </ShortcutTokens>
      {/*<Button onClick={onClearClick}>
   <Icon icon={trashIcon} height={24} />
   Clear Todos
   </Button> */}
      <Infobox text={TasksHelp} />
    </StyledTaskHeader>
  )
}

export default TaskHeader

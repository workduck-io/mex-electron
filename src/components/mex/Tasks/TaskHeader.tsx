import React, { useMemo, useState } from 'react'

import { useTaskViewModalStore } from '@components/mex/TaskViewModal'
import { TasksHelp } from '@data/Defaults/helpText'
import { useTaskViews, useViewStore } from '@hooks/useTaskViews'
import trashIcon from '@iconify/icons-codicon/trash'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import arrowLeftRightLine from '@iconify/icons-ri/arrow-left-right-line'
import checkboxLine from '@iconify/icons-ri/checkbox-line'
import dragMove2Fill from '@iconify/icons-ri/drag-move-2-fill'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import stackLine from '@iconify/icons-ri/stack-line'
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

import {
  Button,
  IconButton,
  Infobox,
  ToolbarTooltip,
  DisplayShortcut,
  LoadingButton
} from '@workduck-io/mex-components'

import { View } from '../../../types/data'
import { Filter, GlobalFilterJoin } from '../../../types/filters'

interface TaskHeaderProps {
  currentView?: View
  currentFilters: Filter[]
  cardSelected: boolean
  globalJoin: GlobalFilterJoin
}

const TaskHeader = ({ currentView, currentFilters, cardSelected, globalJoin }: TaskHeaderProps) => {
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { deleteView } = useTaskViews()

  const { goTo } = useRouting()

  const [source, target] = useSingleton()
  const [deleting, setDeleting] = useState(false)

  const isCurrentViewChanged = useMemo(() => {
    return !(
      JSON.stringify(currentFilters) === JSON.stringify(currentView?.filters) && globalJoin === currentView?.globalJoin
    )
  }, [currentFilters, currentView, globalJoin])

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
                {isCurrentViewChanged && '*'}
              </TaskViewTitle>
              <TaskViewControls>
                <Button
                  onClick={() =>
                    openTaskViewModal({
                      filters: currentFilters,
                      updateViewId: currentView?.id,
                      globalJoin
                    })
                  }
                  disabled={currentFilters.length === 0}
                  primary={isCurrentViewChanged && currentFilters.length > 0}
                >
                  <Icon icon={edit2Line} />
                  Update View
                </Button>
                <IconButton
                  title="Clone View"
                  onClick={() =>
                    openTaskViewModal({
                      filters: currentView?.filters,
                      cloneViewId: currentView?.id,
                      globalJoin: currentView?.globalJoin
                    })
                  }
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
                  onClick={() =>
                    openTaskViewModal({ filters: currentFilters, cloneViewId: currentView?.id, globalJoin })
                  }
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
              onClick={() => openTaskViewModal({ filters: currentFilters, cloneViewId: currentView?.id, globalJoin })}
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
              Open:
              <DisplayShortcut shortcut="$mod+Enter" />
            </ShortcutToken>
            <ShortcutToken>
              Move:
              <DisplayShortcut shortcut="Shift" />
              <Icon icon={arrowLeftRightLine} />
            </ShortcutToken>
            <ShortcutToken>
              Priority:
              <DisplayShortcut shortcut="$mod+0-3" />
            </ShortcutToken>
          </>
        )}
        {currentFilters.length > 0 && (
          <ShortcutToken>
            Remove Filter:
            <DisplayShortcut shortcut="Shift+F" />
          </ShortcutToken>
        )}
        {/*<ShortcutToken>
          {cardSelected || currentFilters.length > 0 ? 'Clear Filters:' : 'Navigate to Editor:'}
          <DisplayShortcut shortcut="Esc" />
        </ShortcutToken> */}
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

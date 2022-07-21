import { useViewStore, View } from '@hooks/useTaskViews'
import Tippy, { useSingleton } from '@tippyjs/react'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { ItemContent, ItemTitle, StyledTreeItem } from '@style/Sidebar'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { BList, SItem, SnippetListWrapper } from './SharedNotes.style'
import home7Line from '@iconify/icons-ri/home-7-line'
import stackLine from '@iconify/icons-ri/stack-line'
import { TooltipContent } from './Tree'
import * as ContextMenu from '@radix-ui/react-context-menu'
import TaskViewContextMenu from './TaskViewContextMenu'

const TaskViewList = () => {
  const views = useViewStore((store) => store.views)
  const currentView = useViewStore((store) => store.currentView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()

  const location = useLocation()

  const onOpenView = (view: View<any>) => {
    // loadSnippet(id)
    setCurrentView(view)
    goTo(ROUTE_PATHS.tasks, NavigationType.push, view.id)
  }

  const onOpenDefaultView = () => {
    // loadSnippet(id)
    setCurrentView(undefined)
    goTo(ROUTE_PATHS.tasks, NavigationType.push)
  }

  const showSelected = useMemo(() => {
    if (location.pathname === ROUTE_PATHS.tasks) {
      return false
    }
    return true
  }, [location.pathname])

  const [source, target] = useSingleton()

  const sortedViews = React.useMemo(() => {
    return views.sort((a, b) => {
      if (a.title < b.title) {
        return -1
      }
      if (a.title > b.title) {
        return 1
      }
      return 0
    })
  }, [views])

  // mog('Snippy', { snippets, showSelected, location })

  return (
    <SnippetListWrapper>
      <Tippy theme="mex" placement="right" singleton={source} />
      <BList>
        <StyledTreeItem noSwitcher selected={currentView === undefined}>
          <ItemContent onMouseDown={() => onOpenDefaultView()}>
            <ItemTitle>
              <Icon icon={home7Line} />
              <span>Default</span>
            </ItemTitle>
          </ItemContent>
        </StyledTreeItem>
        {sortedViews.map((view) => (
          <Tippy
            theme="mex"
            placement="right"
            singleton={target}
            key={`DisplayTippy_${view.id}`}
            content={<TooltipContent item={{ id: view.id, children: [], data: { title: view.title } }} />}
          >
            <span>
              <ContextMenu.Root>
                <ContextMenu.Trigger asChild>
                  <StyledTreeItem noSwitcher selected={showSelected && view?.id === currentView?.id}>
                    <ItemContent onClick={() => onOpenView(view)}>
                      <ItemTitle>
                        <Icon icon={stackLine} />
                        <span>{view.title}</span>
                      </ItemTitle>
                    </ItemContent>
                  </StyledTreeItem>
                </ContextMenu.Trigger>
                <TaskViewContextMenu view={view} />
                {/*<ArchiveContextMenu item={item} />*/}
              </ContextMenu.Root>
            </span>
          </Tippy>
        ))}
      </BList>
    </SnippetListWrapper>
  )
}

export default TaskViewList

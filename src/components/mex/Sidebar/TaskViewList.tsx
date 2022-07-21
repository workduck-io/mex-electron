import { useViewStore, View } from '@hooks/useTaskViews'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { ItemContent, ItemTitle } from '@style/Sidebar'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { BList, SItem, SnippetListWrapper } from './SharedNotes.style'
import home7Line from '@iconify/icons-ri/home-7-line'
import stackLine from '@iconify/icons-ri/stack-line'

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
      <BList>
        <SItem selected={currentView === undefined} key={'Task_View_Default'} onClick={() => onOpenDefaultView()}>
          <ItemContent>
            <ItemTitle>
              <Icon icon={home7Line} />
              Default
            </ItemTitle>
          </ItemContent>
        </SItem>
        {sortedViews.map((view) => (
          <SItem selected={showSelected && view?.id === currentView?.id} key={view.id} onClick={() => onOpenView(view)}>
            <ItemContent>
              <ItemTitle>
                <Icon icon={stackLine} />
                {view.title}
              </ItemTitle>
            </ItemContent>
          </SItem>
        ))}
      </BList>
    </SnippetListWrapper>
  )
}

export default TaskViewList

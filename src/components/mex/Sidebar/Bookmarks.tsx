import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'
import Tippy, { useSingleton } from '@tippyjs/react'
import { PinnedList } from '@ui/sidebar/Sidebar.style'
import { mog } from '@utils/lib/helper'
import { getPartialTreeGroups } from '@utils/lib/paths'
import pushpinLine from '@iconify/icons-ri/pushpin-line'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'
import { useMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import SidebarList from './SidebarList'
import SidebarListItemComponent from './SidebarListItem'
import BookmarkButton from '../Buttons/BookmarkButton'

export const Centered = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`

const Bookmarks = () => {
  const bookmarks = useDataStore((store) => store.bookmarks)
  const { getPathFromNodeid } = useLinks()
  const { push } = useNavigation()
  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const { goTo } = useRouting()
  // const [ bookmarks, setBookmarks ] = useState<string[]>([])
  const [source, target] = useSingleton()

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const bookmarkItems = bookmarks
    .map((nodeid) => ({
      id: nodeid,
      label: getPathFromNodeid(nodeid),
      icon: pushpinLine,
      data: {}
    }))
    .filter((item) => item.label !== undefined)
    .reverse()
    .slice(0, 5)
    .reverse()

  mog('Bookmarks', { bookmarks, bookmarkItems })

  return (
    <>
      <Tippy theme="mex" placement="right" singleton={source} />
      <PinnedList>
        {bookmarkItems.map((b, i) => (
          <SidebarListItemComponent
            key={`bookmark_${b.id}`}
            item={b}
            contextMenu={{
              setContextOpenViewId: () => undefined,
              contextOpenViewId: ''
            }}
            select={{
              onSelect: onOpenNode,
              selectIndex: -1,
              selectedItemId: ''
            }}
            index={i}
            tippyTarget={target}
          />
        ))}
        <BookmarkButton />
      </PinnedList>
    </>
  )
}

export default Bookmarks

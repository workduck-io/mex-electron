import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'
import { mog } from '@utils/lib/helper'
import { getPartialTreeGroups } from '@utils/lib/paths'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'
import { useMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import SidebarList from './SidebarList'

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

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const bookmarkItems = bookmarks
    .map((nodeid) => ({
      id: nodeid,
      title: getPathFromNodeid(nodeid),
      icon: bookmarkLine
    }))
    .filter((item) => item.title !== undefined)

  const groupedBookmarks = getPartialTreeGroups(
    bookmarkItems.map((item) => ({ id: item.id, title: item.title })),
    (item) => item.title,
    (item1, item2) => item1.title.localeCompare(item2.title)
  )

  mog('Bookmarks', { bookmarks, bookmarkItems, groupedBookmarks })

  return bookmarkItems.length > 0 ? (
    <SidebarList
      items={bookmarkItems}
      onClick={onOpenNode}
      noMargin
      selectedItemId={match?.params?.nodeid}
      showSearch
      searchPlaceholder="Filter bookmarks..."
      emptyMessage="No bookmarks found"
    />
  ) : (
    <Centered>
      <Icon icon={bookmarkLine} height={64} width={64} style={{ margin: '0 0 1rem 0' }} />
      <span>No bookmarks yet!</span>
    </Centered>
  )
}

export default Bookmarks

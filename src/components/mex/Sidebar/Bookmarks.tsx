import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'
import { useMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import SidebarList from './SidebarList'

const BList = styled.div`
  /* max-height: 15rem;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto; */
  height: 100%;
  padding: ${({ theme }) => theme.spacing.small};
`

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

  const bookmarkItems = bookmarks.map((nodeid) => ({
    id: nodeid,
    title: getPathFromNodeid(nodeid),
    icon: bookmarkLine
  }))

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

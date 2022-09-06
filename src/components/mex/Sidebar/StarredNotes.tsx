import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import Tippy, { useSingleton } from '@tippyjs/react'
import { PinnedList } from '@ui/sidebar/Sidebar.style'
import { mog } from '@utils/lib/helper'
import starFill from '@iconify/icons-ri/star-fill'

import { useBookmarks } from '@hooks/useBookmarks'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { getTitleFromPath, useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import StarNoteButton from '../Buttons/StarNoteButton'
import SidebarListItemComponent from './SidebarListItem'
import { useEditorStore } from '@store/useEditorStore'

export const Centered = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`

const StarredNotes = () => {
  const bookmarks = useDataStore((store) => store.bookmarks)
  const { getPathFromNodeid } = useLinks()
  const { push } = useNavigation()
  const node = useEditorStore((s) => s.node)
  // const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const { goTo } = useRouting()
  // const [ bookmarks, setBookmarks ] = useState<string[]>([])
  const [source, target] = useSingleton()
  const { removeBookmark } = useBookmarks()

  const currentBmed = useMemo(() => {
    // mog('Bookmarked?', { con })
    return bookmarks.includes(node.nodeid)
  }, [node.nodeid, bookmarks])

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const bookmarkItems = bookmarks
    .map((nodeid) => ({
      id: nodeid,
      label: getTitleFromPath(getPathFromNodeid(nodeid)),
      icon: starFill,
      hoverIcon: closeCircleLine,

      onIconClick: (nodeid: string) => {
        removeBookmark(nodeid)
      },
      data: {}
    }))
    .filter((item) => item.label !== undefined)
    .reverse()
    .slice(0, 5)
    .reverse()

  // mog('Bookmarks', { bookmarks, bookmarkItems })

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
        {bookmarkItems.length < 5 && <StarNoteButton />}
      </PinnedList>
    </>
  )
}

export default StarredNotes

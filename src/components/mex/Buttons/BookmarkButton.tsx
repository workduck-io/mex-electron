import { Icon } from '@iconify/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useBookmarks } from '../../../hooks/useBookmarks'
import pushpinLine from '@iconify/icons-ri/pushpin-line'
import { useEditorStore } from '@store/useEditorStore'
import useDataStore from '@store/useDataStore'
import { PinNoteButton } from '@ui/sidebar/Sidebar.style'
import { getTitleFromPath, useLinks } from '@hooks/useLinks'

// interface BookmarkButtonProps {
//   nodeid: string
// }

const BookmarkButton = () => {
  const node = useEditorStore((s) => s.node)
  const { isBookmark, addBookmark, removeBookmark } = useBookmarks()
  const [bmed, setBmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const { getPathFromNodeid } = useLinks()

  const nodeid = node?.nodeid ?? ''

  const bookmarks = useDataStore((state) => state.addBookmarks)

  useEffect(() => {
    const con = isBookmark(nodeid)

    // mog('Bookmarked?', { con })
    setBmed(con)
  }, [nodeid, bookmarks])

  const onBookmark = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    if (isBookmark(nodeid)) {
      // console.log('Removing')
      await removeBookmark(nodeid)
      setBmed(false)
    } else {
      // console.log('Adding')
      await addBookmark(nodeid)
      setBmed(true)
    }
    setLoading(false)
  }

  const noteTitle = useMemo(() => {
    return getTitleFromPath(getPathFromNodeid(node.nodeid))
  }, [node])

  const label = bmed ? `Unpin ${noteTitle}` : `Pin ${noteTitle}`

  return (
    <PinNoteButton dots={5} loading={loading} highlight={bmed} onClick={onBookmark} transparent={false}>
      <Icon width={24} icon={pushpinLine} />
      <span>{label}</span>
    </PinNoteButton>
  )
}

export default BookmarkButton

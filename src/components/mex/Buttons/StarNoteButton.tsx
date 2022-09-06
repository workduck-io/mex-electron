import { Icon } from '@iconify/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useBookmarks } from '../../../hooks/useBookmarks'
import starLine from '@iconify/icons-ri/star-line'
import { useEditorStore } from '@store/useEditorStore'
import useDataStore from '@store/useDataStore'
import { SStarNoteButton } from '@ui/sidebar/Sidebar.style'
import { getTitleFromPath, useLinks } from '@hooks/useLinks'

// interface BookmarkButtonProps {
//   nodeid: string
// }

const StarNoteButton = () => {
  const node = useEditorStore((s) => s.node)
  const { isBookmark, addBookmark, removeBookmark } = useBookmarks()
  const [bmed, setBmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const { getPathFromNodeid } = useLinks()

  const nodeid = node?.nodeid ?? ''

  const bookmarks = useDataStore((state) => state.bookmarks)

  useEffect(() => {
    const con = isBookmark(nodeid)
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

  const label = `Star ${noteTitle}`

  return (
    <SStarNoteButton dots={5} loading={loading} highlight={bmed} onClick={onBookmark} transparent={false}>
      <Icon width={24} icon={starLine} />
      <span>{label}</span>
    </SStarNoteButton>
  )
}

export default StarNoteButton

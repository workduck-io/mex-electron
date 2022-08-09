import bookmarkFill from '@iconify/icons-ri/bookmark-fill'
import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'
import { LoadingButton } from '@workduck-io/mex-components'
import React, { useEffect, useState } from 'react'
import { useBookmarks } from '../../../hooks/useBookmarks'

interface BookmarkButtonProps {
  nodeid: string
}

const BookmarkButton = ({ nodeid }: BookmarkButtonProps) => {
  const { isBookmark, addBookmark, removeBookmark } = useBookmarks()
  const [bmed, setBmed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const con = isBookmark(nodeid)

    // mog('Bookmarked?', { con })
    setBmed(con)
  }, [nodeid])

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

  // mog('BookmarkButton', { bmed, bookmarks, loading, nodeid })

  return (
    <LoadingButton dots={2} loading={loading} highlight={bmed} onClick={onBookmark} transparent={false}>
      <Icon width={24} icon={bmed ? bookmarkFill : bookmarkLine} />
    </LoadingButton>
  )
}

export default BookmarkButton

import React, { useEffect, useMemo, useState } from 'react'
// import IconButton from '../../Styled/Buttons'
import { useBookmarks } from '../../Hooks/useBookmarks/useBookmarks'
import useDataStore from '../../Editor/Store/DataStore'
import { LoadingButton } from './LoadingButton'
import { Icon } from '@iconify/react'
import bookmarkLine from '@iconify-icons/ri/bookmark-line'
import bookmarkFill from '@iconify-icons/ri/bookmark-fill'

interface BookmarkButtonProps {
  uid: string
}

const BookmarkButton = ({ uid }: BookmarkButtonProps) => {
  const { isBookmark, addBookmark, removeBookmark } = useBookmarks()
  const bookmarks = useDataStore((store) => store.bookmarks)
  const [bmed, setBmed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setBmed(isBookmark(uid))
  }, [bookmarks])

  const onBookmark = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    if (isBookmark(uid)) {
      console.log('Removing')
      await removeBookmark(uid)
    } else {
      console.log('Adding')
      await addBookmark(uid)
    }
    setLoading(false)
  }

  return (
    <LoadingButton dots={2} loading={loading} buttonProps={{ highlight: bmed, onClick: onBookmark }}>
      <Icon width={24} icon={bmed ? bookmarkFill : bookmarkLine} />
    </LoadingButton>
  )
}

export default BookmarkButton

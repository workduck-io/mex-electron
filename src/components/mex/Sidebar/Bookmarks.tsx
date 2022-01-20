import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Icon } from '@iconify/react'
import bookmarkLine from '@iconify-icons/ri/bookmark-line'
import { useBookmarks } from '../../../hooks/useBookmarks'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import { BaseLink } from '../../../views/mex/Tag'

const BList = styled.div`
  max-height: 15rem;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.small};
`

const BLink = styled(BaseLink)`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
  margin: 0 0 ${({ theme }) => theme.spacing.tiny};
  svg {
    margin-right: ${({ theme }) => theme.spacing.tiny};
    color: ${({ theme }) => theme.colors.text.fade};
  }
  &:hover {
    svg {
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    }
  }
`

const Bookmarks = () => {
  const bookmarks = useDataStore((store) => store.bookmarks)
  const { getAllBookmarks } = useBookmarks()
  const { getNodeIdFromUid } = useLinks()
  const { push } = useNavigation()
  // const [ bookmarks, setBookmarks ] = useState<string[]>([])

  useEffect(() => {
    // ssetBookmarks(
    getAllBookmarks()
  }, [])

  return (
    <BList>
      {bookmarks.map((uid) => {
        if (getNodeIdFromUid(uid) === undefined) return null
        return (
          <BLink key={`bookmark_link_${uid}`} onClick={() => push(uid)}>
            <Icon height={14} icon={bookmarkLine} />
            {getNodeIdFromUid(uid)}
          </BLink>
        )
      })}
    </BList>
  )
}

export default Bookmarks

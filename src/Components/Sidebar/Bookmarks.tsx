import React, { useEffect } from 'react'
import { useBookmarks } from '../../Hooks/useBookmarks/useBookmarks'
import useDataStore from '../../Editor/Store/DataStore'
import { useLinks } from '../../Editor/Actions/useLinks'
import styled from 'styled-components'
import { NodeLink } from '../Backlinks/Backlinks'
import { useNavigation } from '../../Hooks/useNavigation/useNavigation'
import { Icon } from '@iconify/react'
import bookmarkLine from '@iconify-icons/ri/bookmark-line'

const BList = styled.div`
  max-height: 15rem;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.small};
`

const BLink = styled(NodeLink)`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
  margin: 0 0 ${({ theme }) => theme.spacing.tiny};
  svg {
    margin-right: ${({ theme }) => theme.spacing.tiny};
    color: ${({ theme }) => theme.colors.text.fade};
  }
  &:nth-child(2n) {
    background: inherit;
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
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

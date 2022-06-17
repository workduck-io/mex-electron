import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'
import { MexIcon } from '@style/Layouts'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useBookmarks } from '../../../hooks/useBookmarks'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import { BaseLink } from '../../../views/mex/Tag'

const BList = styled.div`
  /* max-height: 15rem;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto; */
  height: 100%;
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
  // const [ bookmarks, setBookmarks ] = useState<string[]>([])

  // useEffect(() => {
  //   // ssetBookmarks(
  //   getAllBookmarks()
  // }, [])

  return (
    <BList>
      {bookmarks.map((nodeid) => {
        if (getPathFromNodeid(nodeid) === undefined) return null
        return (
          <BLink key={`bookmark_link_${nodeid}`} onClick={() => push(nodeid)}>
            <Icon height={14} icon={bookmarkLine} />
            {getPathFromNodeid(nodeid)}
          </BLink>
        )
      })}
      {bookmarks.length === 0 && (
        <Centered>
          <MexIcon height={24} width={24} icon="ri:bookmark-line" margin="0 0 1rem 0" />
          <span>No Notes bookmarked yet!</span>
        </Centered>
      )}
    </BList>
  )
}

export default Bookmarks

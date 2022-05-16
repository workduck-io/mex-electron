import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import styled from 'styled-components'
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

const SharedNotes = () => {
  const sharedNodes = useDataStore((store) => store.sharedNodes)
  const { push } = useNavigation()
  // const [ bookmarks, setBookmarks ] = useState<string[]>([])

  // useEffect(() => {
  //   // ssetBookmarks(
  //   getAllBookmarks()
  // }, [])

  return (
    <BList>
      {sharedNodes.map((sharedNode) => {
        return (
          <BLink key={`shared_notes_link_${sharedNode.nodeid}`} onClick={() => push(sharedNode.nodeid)}>
            <Icon height={14} icon={bookmarkLine} />
            {sharedNode.path}
          </BLink>
        )
      })}
      {sharedNodes.length === 0 && <div>No one shared notes with you yet!</div>}
    </BList>
  )
}

export default SharedNotes

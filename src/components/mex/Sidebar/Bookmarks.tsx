import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'
import { MexIcon } from '@style/Layouts'
import { ItemContent, ItemTitle } from '@style/Sidebar'
import Tippy from '@tippyjs/react'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'
import { useMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import { SItem } from './SharedNotes.style'
import { TooltipContent } from './Tree'

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

  return (
    <BList>
      {bookmarks.map((nodeid) => {
        if (getPathFromNodeid(nodeid) === undefined) return null
        return (
          <Tippy
            theme="mex"
            placement="right"
            key={`bookmarked_notes_link_tooltip${nodeid}`}
            content={
              <TooltipContent
                item={{
                  id: nodeid,
                  children: [],
                  data: {
                    title: getPathFromNodeid(nodeid),
                    nodeid
                  }
                }}
              />
            }
          >
            <SItem
              selected={match?.params?.nodeid === nodeid}
              key={`bookmarked_notes_link_${nodeid}`}
              onClick={() => onOpenNode(nodeid)}
            >
              <ItemContent>
                <ItemTitle>
                  <Icon height={14} icon={bookmarkLine} />
                  <span>{getPathFromNodeid(nodeid)}</span>
                </ItemTitle>
              </ItemContent>
            </SItem>
          </Tippy>
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

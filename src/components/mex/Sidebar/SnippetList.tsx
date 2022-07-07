import React, { useMemo } from 'react'
import { useSnippetStore } from '@store/useSnippetStore'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { BList, SItem, SnippetListWrapper } from './SharedNotes.style'
import { ItemContent, ItemTitle } from '@style/Sidebar'
import { mog } from '@utils/lib/helper'
import { useLocation } from 'react-router-dom'

const SnippetList = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const currentSnippet = useSnippetStore((store) => store.editor.snippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { goTo } = useRouting()

  const location = useLocation()

  const onOpenSnippet = (id: string, title: string) => {
    loadSnippet(id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title })
  }

  const showSelected = useMemo(() => {
    if (location.pathname === ROUTE_PATHS.snippets) {
      return false
    }
    return true
  }, [location.pathname])

  const sortedSnippets = React.useMemo(() => {
    return snippets.sort((a, b) => {
      if (a.title < b.title) {
        return -1
      }
      if (a.title > b.title) {
        return 1
      }
      return 0
    })
  }, [snippets])

  // mog('Snippy', { snippets, showSelected, location })

  return (
    <SnippetListWrapper>
      <BList>
        {sortedSnippets.map((snippet) => (
          <SItem
            selected={showSelected && snippet?.id === currentSnippet?.id}
            key={snippet.id}
            onClick={() => onOpenSnippet(snippet.id, snippet.title)}
          >
            <ItemContent>
              <ItemTitle>
                <Icon icon={snippet.icon ?? quillPenLine} />
                {snippet.title}
              </ItemTitle>
            </ItemContent>
          </SItem>
        ))}
      </BList>
    </SnippetListWrapper>
  )
}

export default SnippetList

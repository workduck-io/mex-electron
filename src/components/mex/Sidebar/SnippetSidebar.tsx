import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { useSnippetStore } from '@store/useSnippetStore'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useState, useEffect } from 'react'
import { debounce } from 'lodash'
import SidebarList from './SidebarList'
import magicLine from '@iconify/icons-ri/magic-line'
import { SidebarWrapper } from '@ui/sidebar/Sidebar.style'
import { SidebarHeaderLite } from '@ui/sidebar/Sidebar.space.header'
import {
  SnippetCardFooter,
  SnippetCardHeader,
  SnippetCards,
  SnippetCardWrapper,
  SnippetContentPreview
} from './SnippetSidebar.style'
import { Icon } from '@iconify/react'
import { SidebarListFilter } from './SidebarList.style'
import searchLine from '@iconify/icons-ri/search-line'
import { convertContentToRawText, mog } from '@workduck-io/mex-utils'
import { useSearch } from '@hooks/useSearch'
import { GenericSearchResult } from '../../../types/search'
import { Input } from '@style/Form'
import { Snippet } from '../../../types/data'

const SnippetSidebar = () => {
  const [search, setSearch] = useState('')

  const snippets = useSnippetStore((store) => store.snippets)
  // const currentSnippet = useSnippetStore((store) => store.editor.snippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { goTo } = useRouting()
  const { queryIndex } = useSearch()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const [searchedSnippets, setSearchedSnippets] = useState<Snippet[]>(snippets)

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
    const snippet = snippets.find((snippet) => snippet.id === id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title: snippet?.title })
  }

  const onInsertSnippet = (id: string) => {
    // TODO: insert snippet in editor
    mog('onInsertSnippet', { id })
  }

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  /**
   * Set the searched snippets after getting search from index
   */
  const onSearch = async (newSearchTerm: string) => {
    const res = await queryIndex(['template', 'snippet'], newSearchTerm)

    if (newSearchTerm === '' && res.length === 0) {
      setSearchedSnippets(snippets)
    } else {
      const searched = res
        .map((r) => {
          const snippet = snippets.find((snippet) => snippet.id === r.id)
          if (snippet) {
            return snippet
          } else return undefined
        })
        .filter((s) => s !== undefined) as Snippet[]
      setSearchedSnippets(searched)
    }
  }

  useEffect(() => {
    if (search && search !== '') {
      onSearch(search)
      // return searched
    }
    if (search === '') {
      setSearchedSnippets(snippets)
    }
  }, [snippets, search])

  return (
    <SnippetCards>
      <SidebarListFilter noMargin={true}>
        <Icon icon={searchLine} />
        <Input placeholder={'Search snippets'} onChange={debounce((e) => onSearchChange(e), 250)} ref={inputRef} />
      </SidebarListFilter>
      {searchedSnippets.map((snippet) => (
        <SnippetCardWrapper onClick={() => onInsertSnippet(snippet.id)} key={`snippet_card_${snippet.id}`}>
          <SnippetCardHeader>
            <Icon icon={snippet.template ? magicLine : quillPenLine} />
            {snippet.title}
          </SnippetCardHeader>

          <SnippetContentPreview>{convertContentToRawText(snippet.content, ' ')}</SnippetContentPreview>
          <SnippetCardFooter></SnippetCardFooter>
        </SnippetCardWrapper>
      ))}
    </SnippetCards>
  )
}

export default SnippetSidebar

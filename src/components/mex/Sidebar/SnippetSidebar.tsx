import { useSearch } from '@hooks/useSearch'
import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { useSnippetStore } from '@store/useSnippetStore'
import { TagsLabel } from '@components/mex/Tags/TagLabel'
import { Input } from '@style/Form'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { convertContentToRawText, getTagsFromContent, mog } from '@workduck-io/mex-utils'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Snippet } from '../../../types/data'
import { SidebarListFilter } from './SidebarList.style'
import {
  SnippetCardFooter,
  SnippetCardHeader,
  SnippetCards,
  SnippetCardWrapper,
  SnippetContentPreview
} from './SnippetSidebar.style'
import { getPlateEditorRef, insertNodes, selectEditor, TElement } from '@udecode/plate'

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

  const snippetTags = useMemo(() => {
    const tags = snippets.reduce(
      (p, snippet) => ({ ...p, [snippet.id]: getTagsFromContent(snippet.content).map((tag) => ({ value: tag })) }),
      {}
    )
    return tags
  }, [snippets])

  const onInsertSnippet = (id: string) => {
    // TODO: insert snippet in editor
    mog('onInsertSnippet', { id })
    const snippet = snippets.find((snippet) => snippet.id === id)
    if (!snippet) return
    const editor = getPlateEditorRef()
    const selection = editor.selection
    insertNodes<TElement>(editor, snippet.content)
    selectEditor(editor, { at: selection, edge: 'start', focus: true })
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

  // mog('SnippetSidebar', { snippets, searchedSnippets, snippetTags })

  return (
    <SnippetCards>
      <SidebarListFilter noMargin={true}>
        <Icon icon={searchLine} />
        <Input placeholder={'Search snippets'} onChange={debounce((e) => onSearchChange(e), 250)} ref={inputRef} />
      </SidebarListFilter>
      {searchedSnippets.map((snippet) => (
        <SnippetCardWrapper key={`snippet_card_${snippet.id}`}>
          <SnippetCardHeader onClick={() => onInsertSnippet(snippet.id)}>
            <Icon icon={snippet.template ? magicLine : quillPenLine} />
            {snippet.title}
          </SnippetCardHeader>

          <SnippetContentPreview>{convertContentToRawText(snippet.content, ' ')}</SnippetContentPreview>
          <SnippetCardFooter>
            <TagsLabel tags={snippetTags[snippet.id]} />
          </SnippetCardFooter>
        </SnippetCardWrapper>
      ))}
    </SnippetCards>
  )
}

export default SnippetSidebar

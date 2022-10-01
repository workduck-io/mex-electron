import { SnippetSidebarHelp } from '@data/Defaults/helpText'
import { sortByLastUsedSnippets, useLastUsedSnippets } from '@hooks/useLastOpened'
import { useSearch } from '@hooks/useSearch'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { useSnippetStore } from '@store/useSnippetStore'
import { Input } from '@style/Form'
import { getPlateEditorRef, insertNodes, selectEditor, TElement } from '@udecode/plate'
import { Infobox } from '@workduck-io/mex-components'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Snippet } from '../../../types/data'
import { SidebarListFilter, SidebarListFilterWrapper } from './SidebarList.style'
import SnippetCard from './SnippetCard'
import { SnippetCards } from './SnippetSidebar.style'

const SnippetSidebar = () => {
  const [search, setSearch] = useState('')

  const snippets = useSnippetStore((store) => store.snippets)
  // const currentSnippet = useSnippetStore((store) => store.editor.snippet)
  const { queryIndex } = useSearch()
  const { addLastUsed } = useLastUsedSnippets()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const [searchedSnippets, setSearchedSnippets] = useState<Snippet[]>(sortByLastUsedSnippets(snippets))

  const onInsertSnippet = (id: string) => {
    // TODO: insert snippet in editor
    // mog('onInsertSnippet', { id })
    const snippet = snippets.find((snippet) => snippet.id === id)
    if (!snippet) return
    const editor = getPlateEditorRef()
    const selection = editor.selection
    insertNodes<TElement>(editor, snippet.content)
    selectEditor(editor, { at: selection, edge: 'start', focus: true })
    addLastUsed(id)
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
      setSearchedSnippets(sortByLastUsedSnippets(snippets))
    } else {
      const searched = res
        .map((r) => {
          const snippet = snippets.find((snippet) => snippet.id === r.id)
          if (snippet) {
            return snippet
          } else return undefined
        })
        .filter((s) => s !== undefined) as Snippet[]
      setSearchedSnippets(sortByLastUsedSnippets(searched))
    }
  }

  useEffect(() => {
    if (search && search !== '') {
      onSearch(search)
      // return searched
    }
    if (search === '') {
      setSearchedSnippets(sortByLastUsedSnippets(snippets))
    }
  }, [snippets, search])

  // mog('SnippetSidebar', { snippets, searchedSnippets, snippetTags })

  return (
    <SnippetCards>
      <SidebarListFilterWrapper>
        <SidebarListFilter noMargin={true}>
          <Icon icon={searchLine} />
          <Input
            autoFocus
            placeholder={'Search snippets'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
          />
        </SidebarListFilter>
        <Infobox text={SnippetSidebarHelp} />
      </SidebarListFilterWrapper>
      {searchedSnippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          keyStr={snippet.id}
          snippet={snippet}
          onClick={() => onInsertSnippet(snippet.id)}
        />
      ))}
    </SnippetCards>
  )
}

export default SnippetSidebar

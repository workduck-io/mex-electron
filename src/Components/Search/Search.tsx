import searchLine from '@iconify-icons/ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useTransition } from 'react-spring'
import create from 'zustand'
import { defaultContent } from '../../Defaults/baseData'
import { useLinks } from '../../Editor/Actions/useLinks'
import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useLoad from '../../Hooks/useLoad/useLoad'
import useSearchStore, { useNewSearchStore } from '../../Search/SearchStore'
import {
  MatchCounter,
  MatchCounterWrapper,
  NoSearchResults,
  Result,
  ResultHeader,
  Results,
  ResultsWrapper,
  ResultTitle,
  SearchContainer,
  SearchHeader,
  SearchInput,
  SearchPreviewWrapper
} from '../../Styled/Search'
import { Title } from '../../Styled/Typography'
import { highlightText, SearchHighlights, TitleHighlights } from './Highlights'

interface SearchStore {
  selected: number
  size: number
  searchTerm: string
  result: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  setSelected: (selected: number) => void
  setResult: (result: any[]) => void // eslint-disable-line @typescript-eslint/no-explicit-any
  setSearchTerm: (searchTerm: string) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}

const useSearchPageStore = create<SearchStore>((set) => ({
  selected: -1,
  size: 0,
  searchTerm: '',
  result: [],
  setSelected: (selected) => set({ selected }),
  setResult: (result) => set({ result }),
  setSearchTerm: (searchTerm) => set({ searchTerm })
}))

const Search = () => {
  // const searchIndex = useSearchStore((store) => store.searchIndex)
  const searchIndex = useNewSearchStore((store) => store.searchIndex)
  const contents = useContentStore((store) => store.contents)
  const selected = useSearchPageStore((store) => store.selected)
  const setSelected = useSearchPageStore((store) => store.setSelected)
  const result = useSearchPageStore((store) => store.result)
  const setResult = useSearchPageStore((store) => store.setResult)
  const searchTerm = useSearchPageStore((store) => store.searchTerm)
  const setSearchTerm = useSearchPageStore((store) => store.setSearchTerm)
  const history = useHistory()
  const { loadNode } = useLoad()
  const inpRef = useRef<HTMLInputElement>(null)

  const { getNodeIdFromUid } = useLinks()

  const transition = useTransition(result, {
    sort: (a, b) => (a.score > b.score ? -1 : 0),
    from: { opacity: 0 },
    enter: { opacity: 1 },
    // update: { opacity: 1, scale: 1.0 },
    // leave: { opacity: 0, scale: 0.5 },
    keys: (item) => item.ref,
    trail: 50,
    duration: 200,
    config: {
      mass: 1,
      tension: 200,
      friction: 16
    }
  })

  const executeSearch = (newSearchTerm: string) => {
    if (newSearchTerm === '') {
      const res = searchIndex(newSearchTerm)
      setResult(res)
    } else {
      const res = searchIndex(newSearchTerm)
      // console.log({ res })
      // const res2 = res.map((r) => {
      //   return {
      //     // ref: r.ref,
      //     // score: r.score,
      //     // ...highlightText(r.matchData.metadata, r.text, r.title)
      //   }
      // })
      setResult(res)
    }
    setSearchTerm(newSearchTerm)
  }

  console.log({ result })

  useEffect(() => {
    executeSearch(searchTerm)
    return () => {
      setSelected(-1)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectNext = () => {
    setSelected((selected + 1) % result.length)
  }

  const selectPrev = () => {
    setSelected((result.length + selected - 1) % result.length)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (e: any) => {
    e.preventDefault()
    const inpSearchTerm = e.target.value
    executeSearch(inpSearchTerm)
  }

  // onKeyDown handler function
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Tab') {
      event.preventDefault()
      // Blur the input if necessary (not needed currently)
      // if (inputRef.current) inputRef.current.blur()
      if (event.shiftKey) {
        selectPrev()
      } else {
        selectNext()
      }
    }
    if (event.code === 'Escape') {
      setSelected(-1)
    }
    if (event.code === 'Enter') {
      // Only when the selected index is -1
      if (selected > -1) {
        loadNode(result[selected].ref)
        history.push('/editor')
      }
    }
  }

  // console.log(element.tagName)
  // console.log('rerendered', { selected, result })

  return (
    <SearchContainer onKeyDown={keyDownHandler}>
      <Title>Search</Title>
      <SearchHeader>
        <Icon icon={searchLine} />
        <SearchInput
          autoFocus
          id="search_nodes"
          name="search_nodes"
          tabIndex={-1}
          placeholder="Search Anything...."
          type="text"
          defaultValue={searchTerm}
          onChange={debounce((e) => onChange(e), 250)}
          onFocus={() => {
            if (inpRef.current) inpRef.current.select()
          }}
          ref={inpRef}
        />
      </SearchHeader>
      <ResultsWrapper>
        <Results>
          {
            /*transition((styles, c, _t, i) => { */
            result.map((c, i) => {
              const con = contents[c.nodeUID]
              const nodeId = getNodeIdFromUid(c.nodeUID)
              const content = con ? con.content : defaultContent
              console.log(c.matchField.includes('title'))
              return (
                <Result
                  onClick={() => {
                    loadNode(c.nodeUID)
                    history.push('/editor')
                  }}
                  selected={i === selected}
                  key={`ResultForSearch_${c.nodeUID}`}
                >
                  <ResultHeader active={c.matchField.includes('title')}>
                    {c.titleHighlights !== undefined && c.titleHighlights.length > 0 ? (
                      <TitleHighlights titleHighlights={c.titleHighlights} />
                    ) : (
                      <ResultTitle>{nodeId}</ResultTitle>
                    )}
                    {c.totalMatches !== undefined && (
                      <MatchCounterWrapper>
                        Matches:
                        <MatchCounter>{c.totalMatches}</MatchCounter>
                      </MatchCounterWrapper>
                    )}
                  </ResultHeader>
                  {c.highlights !== undefined ? (
                    <SearchHighlights highlights={c.highlights} />
                  ) : (
                    <SearchPreviewWrapper active={c.matchField.includes('text')}>
                      <EditorPreviewRenderer content={content} editorId={`editor_${c.nodeUID}`} />
                    </SearchPreviewWrapper>
                  )}
                </Result>
              )
            })
          }
        </Results>
        {result.length === 0 && (
          <NoSearchResults>No results found. Try refining the query or search for a different one.</NoSearchResults>
        )}
      </ResultsWrapper>
    </SearchContainer>
  )
}

export default Search

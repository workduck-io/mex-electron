import searchLine from '@iconify-icons/ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import create from 'zustand'
import { defaultContent } from '../../Defaults/baseData'
import { useLinks } from '../../Editor/Actions/useLinks'
import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useLoad from '../../Hooks/useLoad/useLoad'
import useSearchStore from '../../Search/SearchStore'
import {
  Highlight,
  HighlightWrapper,
  MatchCounter,
  MatchCounterWrapper,
  Result,
  ResultHeader,
  Results,
  ResultTitle,
  SearchContainer,
  SearchHeader,
  SearchInput,
  SearchPreviewWrapper,
  SSearchHighlights
} from '../../Styled/Search'
import { Title } from '../../Styled/Typography'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const highlightText = (metadata: any, content: string, startCut = 15, endCut = 80) => {
  if (content === undefined) return []
  if (metadata === undefined) return []
  const totalMatches = Object.keys(metadata).reduce((prev, k) => {
    // console.log(prev, metadata, metadata[k])
    return prev + metadata[k].text.position.length
  }, 0)
  const highlights = Object.keys(metadata).reduce((prev, k) => {
    const match = metadata[k]
    return {
      ...prev,
      [k]: match.text.position.map((pos: [number, number]) => {
        const start = pos[0]
        const end = pos[0] + pos[1]
        const preStart = start - startCut < 0 ? 0 : start - startCut
        const postEnd = end + endCut < content.length ? end + endCut : end
        return {
          preMatch: content.slice(preStart, start),
          match: content.slice(start, end),
          postMatch: content.slice(end, postEnd)
        }
      })
    }
  }, {})
  return { highlights, totalMatches }
}

interface SearchHighlight {
  preMatch: string
  match: string
  postMatch: string
}

interface SearchHighlightsProps {
  highlights: { [key: string]: SearchHighlight[] }
}

const SearchHighlights = ({ highlights }: SearchHighlightsProps) => {
  // console.log(highlights)
  return (
    <SSearchHighlights>
      {Object.keys(highlights).map((k, i) => {
        return highlights[k].map((h, j) => {
          // console.log(k, h)
          return (
            <HighlightWrapper key={`search_highlight_${h.match}${j}${i}`}>
              ...{h.preMatch}
              <Highlight>{h.match}</Highlight>
              {h.postMatch}
            </HighlightWrapper>
          )
        })
      })}
    </SSearchHighlights>
  )
}

const Search = () => {
  const searchIndex = useSearchStore((store) => store.searchIndex)
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

  useEffect(() => {
    if (searchTerm === '') {
      const res = searchIndex(searchTerm)
      setResult(res)
    } else {
      const res = searchIndex(searchTerm)
      const res2 = res.map((r) => {
        return {
          ref: r.ref,
          ...highlightText(r.matchData.metadata, r.text)
        }
      })
      setResult(res2)
    }
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
    if (inpSearchTerm === '') {
      setResult(searchIndex(''))
      setSearchTerm(inpSearchTerm)
      setSelected(-1)
      return
    }
    const res = searchIndex(inpSearchTerm)
    const res2 = res.map((r) => {
      return {
        ref: r.ref,
        ...highlightText(r.matchData.metadata, r.text)
      }
    })
    // Reset selected index on change of input
    setSelected(-1)
    setResult(res2)
    setSearchTerm(inpSearchTerm)
  }

  // onKeyDown handler function
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // const element = event.target as HTMLElement
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
      // console.log(element.tagName)
      if (selected > -1) {
        loadNode(result[selected].ref)
        history.push('/editor')
      }
    }
  }

  // console.log('rerendered', { selected, result })

  return (
    <SearchContainer onKeyDown={keyDownHandler}>
      <Title>Search</Title>
      <SearchHeader>
        <Icon icon={searchLine} />
        <SearchInput
          autoFocus
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
      <Results>
        {result.map((c, i) => {
          const con = contents[c.ref]
          const nodeId = getNodeIdFromUid(c.ref)
          const content = con ? con.content : defaultContent
          return (
            <Result
              onClick={() => {
                loadNode(c.ref)
                history.push('/editor')
              }}
              selected={i === selected}
              key={`node_${c.ref}`}
            >
              <ResultHeader>
                <ResultTitle>{nodeId}</ResultTitle>
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
                <SearchPreviewWrapper>
                  <EditorPreviewRenderer content={content} editorId={`editor_${c.ref}`} />
                </SearchPreviewWrapper>
              )}
            </Result>
          )
        })}
      </Results>
      {result.length === 0 && <div>No results found. Try refining the query or search for a different one.</div>}
    </SearchContainer>
  )
}

export default Search

import searchLine from '@iconify-icons/ri/search-line'
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import useLoad from '../../Hooks/useLoad/useLoad'
import create from 'zustand'
import { useLinks } from '../../Editor/Actions/useLinks'
import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useSearchStore from '../../Search/SearchStore'
import { Result, ResultHeader, Results, SearchContainer, SearchHeader, SearchInput } from '../../Styled/Search'
import { Title } from '../../Styled/Typography'
import { useHistory } from 'react-router-dom'
import { debounce } from 'lodash'
import { defaultContent } from '../../Defaults/baseData'

interface SearchProps {
  param?: string
}

interface SearchStore {
  selected: number
  size: number
  result: any[]
  setSelected: (selected: number) => void
  setResult: (result: any[]) => void
}

const useSearchPageStore = create<SearchStore>((set) => ({
  selected: -1,
  size: 0,
  result: [],
  setSelected: (selected) => set({ selected }),
  setResult: (result) => set({ result })
}))

const Search = (props: SearchProps) => {
  const searchIndex = useSearchStore((store) => store.searchIndex)
  // const fuse = useSearchStore((store) => store.fuse)
  const contents = useContentStore((store) => store.contents)
  const selected = useSearchPageStore((store) => store.selected)
  const setSelected = useSearchPageStore((store) => store.setSelected)
  const result = useSearchPageStore((store) => store.result)
  const setResult = useSearchPageStore((store) => store.setResult)
  const history = useHistory()
  const { loadNode } = useLoad()

  // const contents = useContentStore((store) => store.contents)
  // const c = Object.keys(contents).filter((f) => f !== '__null__')

  // const fuse = useFuseStore((store) => store.fuse)
  const { getNodeIdFromUid } = useLinks()

  useEffect(() => {
    const res = searchIndex('')
    setResult(res)
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

  const onChange = (e: any) => {
    e.preventDefault()
    const searchTerm = e.target.value
    const res = searchIndex(searchTerm)
    // Reset selected index on change of input
    setSelected(-1)
    setResult(res)
  }

  // onKeyDown handler function
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const element = event.target as HTMLElement
    if (event.code === 'Tab') {
      event.preventDefault()
      // Blur the input if necessary
      // if (inputRef.current) inputRef.current.blur()
      if (event.shiftKey) {
        selectPrev()
      } else {
        selectNext()
      }
    }
    if (event.code === 'Enter') {
      // Only when the selected index is -1
      console.log(element.tagName)
      if (selected > -1) {
        loadNode(result[selected].ref)
        history.push('/editor')
      }
    }
  }

  // useEffect(() => {
  //   testPerfFunc(() => {
  //     searchIndex('Dorian')
  //     }, 1000)
  // }, [])
  //

  console.log('rerendered', { selected, result })

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
          onChange={debounce((e) => onChange(e), 250)}
        />
      </SearchHeader>
      <Results>
        {result.map((c, i) => {
          const con = contents[c.ref]
          const nodeId = getNodeIdFromUid(c.ref)
          const content = con ? con.content : defaultContent
          return (
            <Result selected={i === selected} key={`node_${c.ref}`}>
              <ResultHeader>{nodeId}</ResultHeader>
              <EditorPreviewRenderer content={content} editorId={`editor_${c.ref}`} />
            </Result>
          )
        })}
      </Results>
    </SearchContainer>
  )
}

export default Search

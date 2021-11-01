import searchLine from '@iconify-icons/ri/search-line'
import { Icon } from '@iconify/react'
import React from 'react'
import create from 'zustand'
import { useLinks } from '../../Editor/Actions/useLinks'
import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useSearchStore from '../../Search/SearchStore'
import { Result, ResultHeader, Results, SearchContainer, SearchHeader, SearchInput } from '../../Styled/Search'
import { Title } from '../../Styled/Typography'

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
  const selected = useSearchPageStore((store) => store.selected)
  const setSelected = useSearchPageStore((store) => store.setSelected)
  const result = useSearchPageStore(store => store.result)
  const setResult = useSearchPageStore(store => store.setResult)

  const contents = useContentStore((store) => store.contents)
  const c = Object.keys(contents).filter((f) => f !== '__null__')

  // const fuse = useFuseStore((store) => store.fuse)
  const { getNodeIdFromUid } = useLinks()

  // const inputRef = useRef<HTMLInputElement>(null)

  const selectNext = () => {
    console.log({ selected })
    setSelected((selected + 1) % c.length)
  }

  const selectPrev = () => {
    console.log({ selected })
    setSelected((c.length + selected - 1) % c.length)
  }

  const onChange = (e: any) => {
    e.preventDefault()
    const searchTerm = e.target.value
    const res = searchIndex(searchTerm)
    console.log({ searchTerm, res })
    // console.log(JSON.stringify(fuse, null, 2))
    // console.log(JSON.stringify(fuse.getIndex(), null, 2))
  }

  // onKeyDown handler function
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const element = event.target as HTMLElement
    if (event.code === 'Tab') {
      event.preventDefault()
      // Blur the input if necessary if (inputRef.current) inputRef.current.blur()
      if (event.shiftKey) {
        selectPrev()
      } else {
        selectNext()
      }
    }
    if (event.code === 'Enter') {
      // Only when the selected index is -1
      // Reset selected index on change of input
      console.log(element.tagName)
    }
  }

  // onKeyUp handler function
  // const keyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.code === 'Escape') {
  //     const confirm = window.confirm('Are you sure want to clear this text feild?')

  //     if (confirm) {
  //       setEnteredText('')
  //     }
  //   }
  // }

  // onKeyPress handler function
  // const keyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   // Do something you like with "event"
  // }

  // useEffect(() => {
  //   testPerfFunc(() => {
  //     searchIndex('Dorian')
  //     }, 1000)
  // }, [])
  //

  console.log('rerendered', { selected })

  return (
    <SearchContainer onKeyDown={keyDownHandler}>
      <Title>Search</Title>
      <SearchHeader>
        <Icon icon={searchLine} />
        <SearchInput tabIndex={-1} placeholder="Search Anything...." type="text" onChange={onChange} />
      </SearchHeader>
      <Results>
        {c.map((c, i) => {
          const con = contents[c]
          const nodeId = getNodeIdFromUid(c)
          return (
            <Result selected={i === selected} key={`node_${c}`}>
              <ResultHeader>{nodeId}</ResultHeader>
              <EditorPreviewRenderer content={con.content} editorId={`editor_${c}`} />
            </Result>
          )
        })}
      </Results>
    </SearchContainer>
  )
}

export default Search

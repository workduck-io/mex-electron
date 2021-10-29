import searchLine from '@iconify-icons/ri/search-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { useLinks } from '../../Editor/Actions/useLinks'
import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { useContentStore } from '../../Editor/Store/ContentStore'
import useSearchStore from '../../Search/SearchStore'
import { Result, ResultHeader, Results, SearchContainer, SearchHeader, SearchInput } from '../../Styled/Search'
import { Title } from '../../Styled/Typography'

interface SearchProps {
  param?: string
}

const Search = (props: SearchProps) => {
  const searchIndex = useSearchStore((store) => store.searchIndex)
  // const fuse = useSearchStore((store) => store.fuse)
  const contents = useContentStore((store) => store.contents)
  // const fuse = useFuseStore((store) => store.fuse)
  const { getNodeIdFromUid } = useLinks()

  const onChange = (e: any) => {
    e.preventDefault()
    const searchTerm = e.target.value
    const res = searchIndex(searchTerm)
    console.log({ searchTerm, res })
    // console.log(JSON.stringify(fuse, null, 2))
    // console.log(JSON.stringify(fuse.getIndex(), null, 2))
  }

  const c = Object.keys(contents).filter((f) => f !== '__null__')

  // useEffect(() => {
  //   testPerfFunc(() => {
  //     searchIndex('Dorian')
  //     }, 1000)
  // }, [])
  //
  console.log({ contents })

  return (
    <SearchContainer>
      <Title>Search</Title>
      <SearchHeader>
        <Icon icon={searchLine} />
        <SearchInput placeholder="Search Anything...." type="text" onChange={onChange} />
      </SearchHeader>
      <Results>
        {c.map((c) => {
          const con = contents[c]
          const nodeId = getNodeIdFromUid(c)
          return (
            <Result key={`node_${c}`}>
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

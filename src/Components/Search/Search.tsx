import React, { useEffect } from 'react'
import { testPerfFunc } from '../../Requests/Save'
import useSearchStore from '../../Search/SearchStore'
import { Title } from '../../Styled/Typography'

interface SearchProps {
  param?: string
}

const Search = (props: SearchProps) => {
  const searchIndex = useSearchStore((store) => store.searchIndex)
  // const fuse = useSearchStore((store) => store.fuse)

  const onChange = (e: any) => {
    e.preventDefault()
    const searchTerm = e.target.value
    const res = searchIndex(searchTerm)
    console.log({ searchTerm, res })
    // console.log(JSON.stringify(fuse, null, 2))
    // console.log(JSON.stringify(fuse.getIndex(), null, 2))
  }

  // useEffect(() => {
  //   testPerfFunc(() => {
  //     searchIndex('Dorian')
  //     }, 1000)
  // }, [])

  return (
    <div>
      <Title>Search</Title>
      <input type="text" onChange={onChange} />
    </div>
  )
}

export default Search

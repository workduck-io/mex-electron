import React, { createContext, useContext, useState } from 'react'

import { ListItemType } from '../../components/spotlight/SearchResults/types'

export enum CategoryType {
  backlink = 'Backlinks',
  pinned = 'Pinned',
  action = 'Quick Actions',
  search = 'Search Results',
  performed = 'Performed Actions',
  meeting = 'Meetings',
  task = 'Task'
}

export type Search = {
  value: string
  type: CategoryType
}

export type ActiveItem = { item: ListItemType; active: boolean }

type SpotlightContextType = {
  search: Search
  setSearch: (val: Search) => void
  selection: any
  setSelection: (val: any) => void
  searchResults: Array<ListItemType>
  setSearchResults: (val: Array<ListItemType>) => void
  activeIndex: number
  setActiveIndex: any
  setActiveItem: any
  activeItem: ActiveItem
  selectedNamespace: string | undefined
  setSelectedNamespace: (val: string) => void
}

const SpotlightContext = createContext<SpotlightContextType>(undefined!)
export const useSpotlightContext = () => useContext(SpotlightContext)

export const SpotlightProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [search, setSearch] = useState<Search>({ value: '', type: CategoryType.search })
  const [selection, setSelection] = useState<any>()
  const [searchResults, setSearchResults] = useState<Array<ListItemType>>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [activeItem, setActiveItem] = useState<ActiveItem>({ item: undefined, active: false })
  const [selectedNamespace, setSelectedNamespace] = useState<string | undefined>(undefined)

  const value = {
    search,
    setSearch,
    selection,
    setSelection,
    activeIndex,
    setActiveIndex,
    activeItem,
    searchResults,
    setSearchResults,
    setActiveItem,
    selectedNamespace,
    setSelectedNamespace
  }

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>
}

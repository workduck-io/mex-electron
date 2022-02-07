import React, { createContext, useContext, useState } from 'react'

export enum SearchType {
  quicklink,
  action,
  search
}

export type Search = {
  value: string
  type: SearchType
}

type SpotlightContextType = {
  search: Search
  setSearch: (val: Search) => void
  selection: any
  setSelection: (val: any) => void
  activeIndex: number
  setActiveIndex: any
}

const SpotlightContext = createContext<SpotlightContextType>(undefined!)
export const useSpotlightContext = () => useContext(SpotlightContext)

export const SpotlightProvider: React.FC = ({ children }: any) => {
  const [search, setSearch] = useState<Search>({ value: '', type: SearchType.search })
  const [selection, setSelection] = useState<any>()
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const value = {
    search,
    setSearch,
    selection,
    setSelection,
    activeIndex,
    setActiveIndex
  }

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>
}

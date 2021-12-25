import React, { createContext, useContext, useState } from 'react'
import { ILink } from '../../Editor/Store/Types'

type SpotlightContextType = {
  search: string
  setSearch: (val: any) => void
  selection: any
  setSelection: (val: any) => void
  editSearchedNode: any
  setEditSearchedNode: (val: any) => void
}

const SpotlightContext = createContext<SpotlightContextType>(undefined!)
export const useSpotlightContext = () => useContext(SpotlightContext)

export const SpotlightProvider: React.FC = ({ children }: any) => {
  const [search, setSearch] = useState<string>('')
  const [selection, setSelection] = useState<any>()
  const [editSearchedNode, setEditSearchedNode] = useState<ILink | { desc: string }>(undefined)

  const value = {
    search,
    setSearch,
    selection,
    setSelection,
    editSearchedNode,
    setEditSearchedNode
  }

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>
}

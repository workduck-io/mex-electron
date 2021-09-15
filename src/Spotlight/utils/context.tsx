import React, { createContext, useContext, useState } from 'react'

type SpotlightContextType = {
  search: string
  setSearch: (val: any) => void
  selection: any
  setSelection: (val: any) => void
}

const SpotlightContext = createContext<SpotlightContextType>(undefined!)
export const useSpotlightContext = () => useContext(SpotlightContext)

export const SpotlightProvider: React.FC = ({ children }: any) => {
  const [search, setSearch] = useState<string>('')
  const [selection, setSelection] = useState<any>()

  const value = {
    search,
    setSearch,
    selection,
    setSelection
  }

  return <SpotlightContext.Provider value={value}>{children}</SpotlightContext.Provider>
}

import { ILink } from '../../types/Types'
import React, { createContext, useContext } from 'react'

type NoteContextType = {
  isNote: boolean
  node: ILink | undefined
  setNode: (node: ILink) => void
}

const NoteContext = createContext<NoteContextType>(undefined!)
export const useNoteContext = () => useContext(NoteContext)

export const NoteProvider = ({ children }: any) => {
  const [node, setNode] = React.useState(undefined)
  const value = {
    isNote: true,
    node,
    setNode
  }

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>
}

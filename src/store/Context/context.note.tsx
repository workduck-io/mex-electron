import React, { createContext, useContext } from 'react'

type NoteContextType = {
  isNote: boolean
}

const NoteContext = createContext<NoteContextType>(undefined!)
export const useNoteContext = () => useContext(NoteContext)

export const NoteProvider = ({ children }: any) => {
  const value = {
    isNote: true
  }

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>
}

import React, { createContext, useContext } from 'react'

type SnippetContextType = {
  isSnippet: boolean
}

const SnippetContext = createContext<SnippetContextType>(undefined!)
export const useSnippetContext = () => useContext(SnippetContext)

export const SnippetProvider: React.FC<React.PropsWithChildren> = ({ children }: any) => {
  const value = {
    isSnippet: true
  }

  return <SnippetContext.Provider value={value}>{children}</SnippetContext.Provider>
}

import { deserializeHTMLToDocumentFragment } from '@udecode/plate'
import React from 'react'
import { Contents, useContentStore } from '../Store/ContentStore'
import useDataStore from '../Store/DataStore'

export const useDelete = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const contents = useContentStore((state) => state.contents)

  const setILinks = useDataStore((state) => state.setIlinks)
  const initContents = useContentStore((state) => state.initContents)

  const getMockDelete = (del: string): string[] => {
    const deleteMap = ilinks.filter((i) => {
      const match = i.text.startsWith(del)
      return match
    })

    const deleted = deleteMap.map((f) => {
      return f.text
    })

    return deleted
  }

  const execDelete = (del: string) => {
    const deleted = getMockDelete(del)

    // Generate the links without deleted ones
    const newIlinks = ilinks.filter((i) => {
      return deleted.indexOf(i.text) === -1
    })

    // Remap the contents for links that remain
    const newContents: Contents = {}
    newIlinks.forEach((l) => {
      newContents[l.text] = contents[l.text]
    })

    setILinks(newIlinks)
    initContents(newContents)

    return { deleted, newLinks: newIlinks }
  }

  return { getMockDelete, execDelete }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withDelete = (Component: any) => {
  return function C2(props: any) {
    const { getMockDelete, execDelete } = useDelete()

    return <Component getMockDelete={getMockDelete} execDelete={execDelete} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}

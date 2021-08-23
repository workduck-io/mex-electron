import React from 'react'
import { Contents, useContentStore } from '../Store/ContentStore'
import useDataStore from '../Store/DataStore'

export const useLinks = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const contents = useContentStore((state) => state.contents)

  const setILinks = useDataStore((state) => state.setIlinks)
  const initContents = useContentStore((state) => state.initContents)

  const getLinks = (content: any[]) => undefined

  const getAllLinks = () => {
    Object.keys(contents).forEach((key) => {
      const content = contents[key]
      // content.content.map((n) => undefined)
    })
  }

  return { getLinks, getAllLinks }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withILinks = (Component: any) => {
  return function C2 (props: any) {
    const links = useLinks()

    return <Component {...links} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}

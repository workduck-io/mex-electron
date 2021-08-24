import React from 'react'
import { NodeLink } from '../../Types/relations'
import { Contents, useContentStore } from '../Store/ContentStore'
import useDataStore from '../Store/DataStore'

const getLinksFromContent = (content: any[]): string[] => {
  let links: string[] = []

  content.map((n) => {
    if (n.type == 'ilink') {
      links.push(n.value)
    }
    if (n.children.length > 0) {
      links = links.concat(getLinksFromContent(n.children))
    }
  })

  return links
}

export const useLinks = () => {
  const ilinks = useDataStore((state) => state.ilinks)
  const contents = useContentStore((state) => state.contents)

  const setILinks = useDataStore((state) => state.setIlinks)
  const initContents = useContentStore((state) => state.initContents)

  const getAllLinks = () => {
    // We assume that all links exist
    const allLinks: NodeLink[] = []
    Object.keys(contents).forEach((key) => {
      const { content } = contents[key]
      const links = getLinksFromContent(content)
      if (links.length > 0) {
        links.forEach((to) => {
          allLinks.push({
            from: key,
            to,
          })
        })
      }
    })

    return allLinks
  }

  const getLinks = (id: string) => {
    const links = getAllLinks()
    const newLinks: { from: string; to: string }[] = []
    links.forEach(({ to, from }) => {
      if (to === id || from === id) {
        newLinks.push({ from, to })
      }
    })
  }

  return { getAllLinks, getLinks }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withILinks = (Component: any) => {
  return function C2(props: any) {
    const links = useLinks()

    return <Component {...links} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}

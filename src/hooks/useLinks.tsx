import { uniq } from 'lodash'
import { ELEMENT_INLINE_BLOCK } from '../editor/Components/InlineBlock/types'
import { useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import { NodeLink } from '../types/relations'
import { CachedILink, ILink } from '../types/Types'
import { hasLink } from '../utils/lib/links'
import { useNodes } from './useNodes'

const getLinksFromContent = (content: any[]): string[] => {
  let links: string[] = []

  content.forEach((n) => {
    if (n.type === 'ilink' || n.type === ELEMENT_INLINE_BLOCK) {
      links.push(n.value)
    }
    if (n.children && n.children.length > 0) {
      links = links.concat(getLinksFromContent(n.children))
    }
  })

  return uniq(links)
}

export const useLinks = () => {
  const contents = useContentStore((state) => state.contents)
  const addInternalLink = useDataStore((state) => state.addInternalLink)
  const removeInternalLink = useDataStore((state) => state.removeInternalLink)
  const linkCache = useDataStore((state) => state.linkCache)
  const { isInArchive } = useNodes()

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
            to
          })
        })
      }
    })

    return allLinks
  }

  const getLinks = (nodeid: string): NodeLink[] => {
    const links = linkCache[nodeid]
    if (links) {
      return links.map((l) => {
        return {
          [l.type]: l.nodeid,
          [l.type === 'from' ? 'to' : 'from']: nodeid
        } as unknown as NodeLink
      })
    }
    return []
  }

  /**
   * Creates a new internal link
   * The link should be unique between two nodes
   * No self links are allowed
   * Returns true if the link is created or false otherwise
   * */
  const createLink = (nodeid: string, nodeLink: NodeLink): boolean => {
    if (nodeLink.to === nodeLink.from) return false

    // console.log('Creating links', { nodeLink })
    // No self links will be added

    let nodeLinks = useDataStore.getState().linkCache[nodeid]
    let secondNodeLinks = useDataStore.getState().linkCache[nodeLink.to]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    nodeLinks.push({ type: 'from', nodeid: '' })
    secondNodeLinks.push({
      type: 'to',
      nodeid: nodeid
    })

    // set({
    //   linkCache: {
    //     ...get().linkCache,
    //     [nodeid]: nodeLinks,
    //     [ilink.nodeid]: secondNodeLinks
    //   }
    // })
    return true
  }

  const getBacklinks = (nodeid: string) => {
    const links = linkCache[nodeid]
    if (links) {
      return links.filter((l) => l.type === 'from' && !isInArchive(l.nodeid) && getPathFromNodeid(l.nodeid))
    }
    return []
  }

  const updateLinksFromContent = (nodeid: string, content: any[]) => {
    // console.log('We are updating links from content', { nodeid, content, linkCache })

    if (content) {
      const links: CachedILink[] = getLinksFromContent(content).map((l) => ({
        type: 'to',
        nodeid: l
      }))

      let currentLinks = linkCache[nodeid]
      if (!currentLinks) currentLinks = []

      const currentToLinks = currentLinks.filter((l) => l.type === 'to')

      const toLinkstoDelete = currentToLinks.filter((l) => {
        return !hasLink(l, links)
      })

      const toLinkstoAdd = links.filter((l) => {
        return !hasLink(l, currentLinks)
      })

      toLinkstoDelete.map((l) => removeInternalLink(l, nodeid))
      toLinkstoAdd.map((l) => addInternalLink(l, nodeid))
    }
  }

  const getNodeidFromPath = (path: string) => {
    const links = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive

    const link = links.find((l) => l.path === path)
    const archivedLink = archive.find((l) => l.path === path)

    if (link) return link.nodeid
    if (archivedLink) return archivedLink.nodeid
  }

  const getPathFromNodeid = (nodeid: string) => {
    const links = useDataStore.getState().ilinks

    const link = links.find((l) => l.nodeid === nodeid)
    if (link) return link.path
  }

  return { getAllLinks, getLinks, getBacklinks, updateLinksFromContent, getNodeidFromPath, getPathFromNodeid, createLink }
}

export const getNodeidFromPathAndLinks = (links: ILink[], path: string) => {
  const link = links.find((l) => l.path === path)
  if (link) return link.nodeid
}

export const getPathFromNodeIdHookless = (nodeid: string) => {
  const links = useDataStore.getState().ilinks
  const archive = useDataStore.getState().archive

  const link = links.find((l) => l.nodeid === nodeid)
  const archivedLink = archive.find((l) => l.nodeid === nodeid)

  if (link) return link.path
  if (archivedLink) return archivedLink.path
}

import { uniq } from 'lodash'
import { ELEMENT_INLINE_BLOCK } from '../editor/Components/InlineBlock/types'
import { useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import { NodeLink } from '../types/relations'
import { CachedILink, ILink } from '../types/Types'
import { hasLink } from '../utils/lib/links'

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

  const getLinks = (uid: string): NodeLink[] => {
    const links = linkCache[uid]
    if (links) {
      return links.map((l) => {
        return {
          [l.type]: l.uid,
          [l.type === 'from' ? 'to' : 'from']: uid
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
  const createLink = (uid: string, nodeLink: NodeLink): boolean => {
    if (nodeLink.to === nodeLink.from) return false

    // console.log('Creating links', { nodeLink })
    // No self links will be added

    let nodeLinks = useDataStore.getState().linkCache[uid]
    let secondNodeLinks = useDataStore.getState().linkCache[nodeLink.to]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    nodeLinks.push({ type: 'from', uid: '' })
    secondNodeLinks.push({
      type: 'to',
      uid: uid
    })

    // set({
    //   linkCache: {
    //     ...get().linkCache,
    //     [uid]: nodeLinks,
    //     [ilink.uid]: secondNodeLinks
    //   }
    // })
    return true
  }

  const getBacklinks = (uid: string) => {
    const links = linkCache[uid]
    if (links) {
      return links.filter((l) => l.type === 'from')
    }
    return []
  }

  const updateLinksFromContent = (uid: string, content: any[]) => {
    // console.log('We are updating links from content', { uid, content, linkCache })

    if (content) {
      const links: CachedILink[] = getLinksFromContent(content).map((l) => ({
        type: 'to',
        uid: getUidFromNodeId(l)
      }))

      let currentLinks = linkCache[uid]
      if (!currentLinks) currentLinks = []

      const currentToLinks = currentLinks.filter((l) => l.type === 'to')

      const toLinkstoDelete = currentToLinks.filter((l) => {
        return !hasLink(l, links)
      })

      const toLinkstoAdd = links.filter((l) => {
        return !hasLink(l, currentLinks)
      })

      toLinkstoDelete.map((l) => removeInternalLink(l, uid))
      toLinkstoAdd.map((l) => addInternalLink(l, uid))
    }
  }

  const getUidFromNodeId = (nodeId: string) => {
    const links = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive

    const link = links.find((l) => l.text === nodeId)
    const archivedLink = archive.find((l) => l.text === nodeId)

    if (link) return link.uid
    if (archivedLink) return archivedLink.uid
  }

  const getNodeIdFromUid = (uid: string) => {
    const links = useDataStore.getState().ilinks

    const link = links.find((l) => l.uid === uid)
    if (link) return link.text
  }

  return { getAllLinks, getLinks, getBacklinks, updateLinksFromContent, getUidFromNodeId, getNodeIdFromUid, createLink }
}

export const getUidFromNodeIdAndLinks = (links: ILink[], nodeId: string) => {
  const link = links.find((l) => l.text === nodeId)
  if (link) return link.uid
}

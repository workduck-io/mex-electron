import { uniq } from 'lodash'
import { hasLink } from '../../Lib/links'
import { NodeLink } from '../../Types/relations'
import { ELEMENT_INLINE_BLOCK } from '../Components/InlineBlock/types'
import { useContentStore } from '../Store/ContentStore'
import useDataStore from '../Store/DataStore'
import { CachedILink, ILink } from '../Store/Types'

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

  const getBacklinks = (uid: string) => {
    const links = linkCache[uid]
    if (links) {
      return links.filter((l) => l.type === 'from')
    }
    return []
  }

  const updateLinksFromContent = (uid: string, content: any[]) => {
    // console.log('We are updating', uid, content, linkCache)

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
    const link = links.find((l) => l.text === nodeId)

    if (link) return link.uid
  }

  const getNodeIdFromUid = (uid: string) => {
    const links = useDataStore.getState().ilinks

    const link = links.find((l) => l.uid === uid)
    if (link) return link.text
  }

  return { getAllLinks, getLinks, getBacklinks, updateLinksFromContent, getUidFromNodeId, getNodeIdFromUid }
}

export const getUidFromNodeIdAndLinks = (links: ILink[], nodeId: string) => {
  const link = links.find((l) => l.text === nodeId)
  if (link) return link.uid
}

import { NodeLink } from '../../Types/relations'
import { useContentStore } from '../Store/ContentStore'
import { uniq } from 'lodash'
import useDataStore from '../Store/DataStore'
import { CachedILink } from '../Store/Types'
import { hasLink } from '../../Lib/links'

const getLinksFromContent = (content: any[]): string[] => {
  let links: string[] = []

  content.forEach((n) => {
    if (n.type === 'ilink') {
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

  const getLinks = (id: string): NodeLink[] => {
    const links = linkCache[id]
    if (links) {
      return links.map((l) => {
        return {
          [l.type]: l.nodeId,
          [l.type === 'from' ? 'to' : 'from']: id
        } as unknown as NodeLink
      })
    }
    return []
  }

  const getBacklinks = (id: string) => {
    const links = linkCache[id]
    if (links) {
      return links.filter((l) => l.type === 'from')
    }
    return []
  }

  const updateLinksFromContent = (nodeId: string, content: any[]) => {
    // console.log('We are updating', nodeId, content, linkCache)

    if (content) {
      const links: CachedILink[] = getLinksFromContent(content).map((l) => ({
        type: 'to',
        nodeId: l
      }))

      let currentLinks = linkCache[nodeId]
      if (!currentLinks) currentLinks = []

      const currentToLinks = currentLinks.filter((l) => l.type === 'to')

      const toLinkstoDelete = currentToLinks.filter((l) => {
        return !hasLink(l, links)
      })

      const toLinkstoAdd = links.filter((l) => {
        return !hasLink(l, currentLinks)
      })

      toLinkstoDelete.map((l) => removeInternalLink(l, nodeId))
      toLinkstoAdd.map((l) => addInternalLink(l, nodeId))
    }
  }

  return { getAllLinks, getLinks, getBacklinks, updateLinksFromContent }
}

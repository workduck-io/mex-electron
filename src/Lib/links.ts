import { CachedILink } from '../Editor/Store/Types'
import { isEqual } from 'lodash'

export const hasLink = (link: CachedILink, links: CachedILink[]): boolean => {
  const filtered = links.filter((l) => {
    return link.nodeId === l.nodeId && link.type === l.type
  })
  return filtered.length > 0
}

export const removeLink = (link: CachedILink, setLinks: CachedILink[]): CachedILink[] => {
  return setLinks.filter((l) => !isEqual(l, link))
}

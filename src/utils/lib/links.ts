import { isEqual } from 'lodash'
import { CachedILink } from '../../types/Types'

export const hasLink = (link: CachedILink, links: CachedILink[]): boolean => {
  const filtered = links.filter((l) => {
    return link.nodeid === l.nodeid && link.type === l.type
  })
  return filtered.length > 0
}

export const removeLink = (link: CachedILink, setLinks: CachedILink[]): CachedILink[] => {
  return setLinks.filter((l) => !isEqual(l, link))
}

import { isEqual } from 'lodash'
import { CachedILink } from '../Editor/Store/Types'

export const hasLink = (link: CachedILink, links: CachedILink[]): boolean => {
  const filtered = links.filter((l) => {
    return link.uid === l.uid && link.type === l.type
  })
  return filtered.length > 0
}

export const removeLink = (link: CachedILink, setLinks: CachedILink[]): CachedILink[] => {
  return setLinks.filter((l) => !isEqual(l, link))
}

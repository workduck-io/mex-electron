import { ILink } from '../Editor/Store/Types'
import { isEqual } from 'lodash'

export const hasLink = (link: ILink, links: ILink[]): boolean => {
  const filtered = links.filter((l) => {
    return link.nodeId === l.nodeId && link.type === l.type
  })
  return filtered.length > 0
}

export const removeLink = (link: ILink, setLinks: ILink[]): ILink[] => {
  return setLinks.filter((l) => !isEqual(l, link))
}

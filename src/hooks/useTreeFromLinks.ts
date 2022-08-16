import { getLevel } from '@store/useDataStore'
import { useUserPreferenceStore } from '@store/userPropertiesStore'
import { useTreeStore } from '@store/useTreeStore'
import { mog } from '@utils/lib/helper'
import { FlatItem, generateTree } from '@utils/lib/tree'
import { ILink } from '../types/Types'

/** Link sanatization
 *
 * Orders the links according to their level in tree
 * Guarantees parent is before child -> Condition required for correct tree
 */
const sanatizeLinks = (links: ILink[]): FlatItem[] => {
  let oldLinks = links
  const newLinks: FlatItem[] = []
  let currentDepth = 1

  while (oldLinks.length > 0) {
    for (const l of links) {
      if (getLevel(l.path) === currentDepth) {
        const ilink = { id: l.path, nodeid: l.nodeid, icon: l.icon }
        newLinks.push(l.parentNodeId ? { ...ilink, parentNodeId: l.parentNodeId } : ilink)
        oldLinks = oldLinks.filter((k) => k.nodeid !== l.nodeid)
      }
    }
    currentDepth += 1
  }

  return newLinks
}

export const useTreeFromLinks = () => {
  const getTreeFromLinks = (links: ILink[]) => {
    const expanded = useTreeStore.getState().expanded
    const lastOpened = useUserPreferenceStore.getState().lastOpenedNotes

    mog('Expanded', { expanded, lastOpened })

    const sanatizedLinks = sanatizeLinks(links)
    const tree = generateTree(sanatizedLinks, expanded)

    return tree
  }

  return { getTreeFromLinks }
}

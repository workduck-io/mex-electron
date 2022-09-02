import { getAllParentIds } from '@components/mex/Sidebar/treeUtils'
import { getLevel } from '@store/useDataStore'
import { useTreeStore } from '@store/useTreeStore'
import { mog } from '@utils/lib/helper'
import { FlatItem, generateTree } from '@utils/lib/tree'
import { ILink } from '../types/Types'
import { uniqBy } from 'lodash'

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

export const getTreeFromLinks = (links: ILink[]) => {
  const expanded = useTreeStore.getState().expanded
  mog('Expanded', { expanded })

  const sanatizedLinks = sanatizeLinks(links)
  const tree = generateTree(sanatizedLinks, expanded)

  return tree
}

export const getPartialTreeFromLinks = (matchedLinks: ILink[], allLinks: ILink[]) => {
  // Contains duplicates
  const dirtyTreeFlatItems = matchedLinks.reduce((p, c) => {
    const parents = getAllParentIds(c.path)
      .map((par) => allLinks.find((l) => l.path === par))
      .map((l) => ({
        id: l.path,
        nodeid: l.nodeid,
        icon: l.icon,
        stub: l.path !== c.path
      }))
      .filter((par) => {
        return par !== undefined
      })
    return [...p, ...parents]
  }, [])

  const treeFlatItems = uniqBy(dirtyTreeFlatItems, 'id')

  const allExpanded = treeFlatItems.map((l) => l.id)

  const tree = generateTree(
    treeFlatItems,
    allExpanded,
    // No need to sort as already ordered by search
    (a, b) => {
      return 0
    }
  )

  // mog('Made the partialTree From Links', { matchedLinks, allLinks, tree, dirtyTreeLinks, treeLinks })
  return tree
}

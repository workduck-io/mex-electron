import { getAllParentIds } from '@components/mex/Sidebar/treeUtils'
import { getLevel } from '@store/useDataStore'
import { useTreeStore } from '@store/useTreeStore'
import { mog } from '@utils/lib/helper'
import { FlatItem, generateTree } from '@utils/lib/tree'
import { uniqBy } from 'lodash'
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

export const getTreeFromLinks = (links: ILink[]) => {
  const expanded = useTreeStore.getState().expanded
  mog('Expanded', { expanded })

  const sanatizedLinks = sanatizeLinks(links)
  const tree = generateTree(sanatizedLinks, expanded)

  return tree
}

/**
 * returns tree data and also the matched items in flat order of occurrence
 */
export const getPartialTreeFromLinks = (matchedLinks: ILink[], allLinks: ILink[]) => {
  // Contains duplicates
  const dirtyTreeFlatItems = matchedLinks.reduce((p, c) => {
    const parents = getAllParentIds(c.path)
      .filter((par) => par !== undefined)
      .map((par) => allLinks.find((l) => l.path === par))
      .filter((l) => l !== undefined)
      .map((l) => ({
        id: l.path,
        nodeid: l.nodeid,
        icon: l.icon,
        stub: l.path !== c.path
      }))
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

  const matchedFlatItems = Object.keys(tree.items)
    .sort()
    .filter((i) => tree.items[i].data.stub === false)
    .map((i) => tree.items[i])

  // mog('Made the partialTree From Links', { matchedLinks, allLinks, tree, treeFlatItems })

  return { tree, matchedFlatItems }
}

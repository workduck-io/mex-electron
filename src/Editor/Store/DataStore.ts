import create from 'zustand'
import { generateTree, getAllParentIds, SEPARATOR } from '../../Components/Sidebar/treeUtils'
import getFlatTree from '../../Lib/flatTree'
import { removeLink } from '../../Lib/links'
import { generateComboText, generateIlink } from './sampleTags'
import { DataStoreState, CachedILink } from './Types'

const useDataStore = create<DataStoreState>((set, get) => ({
  // Tags
  tags: [],

  // Internal links (node ids)
  ilinks: [],

  // Slash commands
  slashCommands: [],

  linkCache: {},

  // Load initial data in the store
  initializeDataStore: (tags, ilinks, slashCommands, linkCache) => {
    set({
      tags,
      ilinks,
      linkCache,
      slashCommands
    })
  },

  // Add a new tag to the store
  addTag: (tag) => {
    set({
      tags: [...get().tags, generateComboText(tag, get().tags.length)]
    })
  },

  // Add a new ILink to the store
  addILink: (ilink) => {
    const linksStrings = get().ilinks.map((l) => l.text)
    const parents = getAllParentIds(ilink) // includes link of child
    const newLinks = parents.filter((l) => !linksStrings.includes(l)) // only create links for non existing
    const comboTexts = newLinks.map((l, index) => {
      return generateIlink(l, get().ilinks.length + index)
    })

    console.log('Link Added')

    set({
      ilinks: [...get().ilinks, ...comboTexts]
    })
  },

  setIlinks: (ilinks) => {
    set({
      ilinks
    })
  },

  setSlashCommands: (slashCommands) => set({ slashCommands }),

  addInternalLink: (ilink, nodeId) => {
    let nodeLinks = get().linkCache[nodeId]
    let secondNodeLinks = get().linkCache[ilink.nodeId]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    nodeLinks.push(ilink)
    secondNodeLinks.push({
      type: ilink.type === 'from' ? 'to' : 'from',
      nodeId
    })

    set({
      linkCache: {
        ...get().linkCache,
        [nodeId]: nodeLinks,
        [ilink.nodeId]: secondNodeLinks
      }
    })
  },

  removeInternalLink: (ilink, nodeId) => {
    let nodeLinks = get().linkCache[nodeId]
    let secondNodeLinks = get().linkCache[ilink.nodeId]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    nodeLinks = removeLink(ilink, nodeLinks)
    const secondLinkToDelete: CachedILink = {
      type: ilink.type === 'from' ? 'to' : 'from',
      nodeId
    }
    secondNodeLinks = removeLink(secondLinkToDelete, secondNodeLinks)

    set({
      linkCache: {
        ...get().linkCache,
        [nodeId]: nodeLinks,
        [ilink.nodeId]: secondNodeLinks
      }
    })
  },

  updateInternalLinks: (links, nodeId) => {
    set({
      linkCache: {
        ...get().linkCache,
        [nodeId]: links
      }
    })
  }
}))

export const getLevel = (id: string) => id.split(SEPARATOR).length

/** Link sanatization
 *
 * Orders the links according to their level in tree
 * Guarantees parent is before child -> Condition required for correct tree
 */
export const sanatizeLinks = (links: string[]): string[] => {
  let oldLinks = links
  const newLinks: string[] = []
  let currentDepth = 1

  while (oldLinks.length > 0) {
    for (const l of links) {
      if (getLevel(l) === currentDepth) {
        newLinks.push(l)
        oldLinks = oldLinks.filter((k) => k !== l)
      }
    }
    currentDepth += 1
  }

  return newLinks
}

export const useTreeFromLinks = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const links = ilinks.map((i) => i.text)
  const sanatizedLinks = sanatizeLinks(links)
  const tree = generateTree(sanatizedLinks)

  return tree
}

export const useFlatTreeFromILinks = () => {
  return getFlatTree(useTreeFromLinks())
}

export default useDataStore

import create from 'zustand'
import { generateTree, getAllParentIds, SEPARATOR } from '../../Components/Sidebar/treeUtils'
import getFlatTree from '../../Lib/flatTree'
import { removeLink } from '../../Lib/links'
import { generateComboText, generateIlink } from './sampleTags'
import { CachedILink, DataStoreState } from './Types'

const useDataStore = create<DataStoreState>((set, get) => ({
  // Tags
  tags: [],

  // Internal links (node ids)
  ilinks: [],

  // Slash commands
  slashCommands: [],

  linkCache: {},

  baseNodeId: '@',

  bookmarks: [],

  // Load initial data in the store
  initializeDataStore: (initData) => {
    set({
      ...initData
      // tags: initData.tags,
      // ilinks: initData.ilinks,
      // linkCache: initData.linkCache,
      // slashCommands: initData.slashCommands,
      // bookmarks: initData.bookmarks,
      // baseNodeId: initData.baseNodeId
    })
  },

  // Add a new tag to the store
  addTag: (tag) => {
    set({
      tags: [...get().tags, generateComboText(tag, get().tags.length)]
    })
  },

  // Add a new ILink to the store
  addILink: (ilink, uid?, parentId?) => {
    if (ilink.startsWith(SEPARATOR) && parentId) {
      ilink = `${parentId}${ilink}`
    }
    const linksStrings = get().ilinks.map((l) => l.text)
    const parents = getAllParentIds(ilink) // includes link of child
    const newLinks = parents.filter((l) => !linksStrings.includes(l)) // only create links for non existing
    const comboTexts = newLinks.map((l, index) => {
      const newILink = generateIlink(l, get().ilinks.length + index)
      if (uid && newILink.text === ilink) {
        newILink.uid = uid
      }
      return newILink
    })
    const newLink = comboTexts.find((l) => l.text === ilink)
    set({
      ilinks: [...get().ilinks, ...comboTexts]
    })

    if (newLink) return newLink.uid
    return ''
  },

  setIlinks: (ilinks) => {
    set({
      ilinks
    })
  },

  setSlashCommands: (slashCommands) => set({ slashCommands }),

  removeBookamarks: (bookmarks) => {
    const ubookmarks = new Set(get().bookmarks.filter((b) => !(bookmarks.indexOf(b) > -1)))
    set({ bookmarks: Array.from(ubookmarks) })
  },

  setBookmarks: (bookmarks) => {
    const ubookmarks = new Set(bookmarks)
    set({ bookmarks: Array.from(ubookmarks) })
  },
  getBookmarks: () => get().bookmarks,

  setBaseNodeId: (baseNodeId) => set({ baseNodeId }),

  addInternalLink: (ilink, uid) => {
    let nodeLinks = get().linkCache[uid]
    let secondNodeLinks = get().linkCache[ilink.uid]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    nodeLinks.push(ilink)
    secondNodeLinks.push({
      type: ilink.type === 'from' ? 'to' : 'from',
      uid: uid
    })

    set({
      linkCache: {
        ...get().linkCache,
        [uid]: nodeLinks,
        [ilink.uid]: secondNodeLinks
      }
    })
  },

  removeInternalLink: (ilink, uid) => {
    let nodeLinks = get().linkCache[uid]
    let secondNodeLinks = get().linkCache[ilink.uid]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    nodeLinks = removeLink(ilink, nodeLinks)
    const secondLinkToDelete: CachedILink = {
      type: ilink.type === 'from' ? 'to' : 'from',
      uid: uid
    }
    secondNodeLinks = removeLink(secondLinkToDelete, secondNodeLinks)

    set({
      linkCache: {
        ...get().linkCache,
        [uid]: nodeLinks,
        [ilink.uid]: secondNodeLinks
      }
    })
  },

  addBookmarks: (bookmarks) => {
    const ubookmarks = new Set([...get().bookmarks, ...bookmarks])
    set({ bookmarks: Array.from(ubookmarks) })
  },

  updateInternalLinks: (links, uid) => {
    set({
      linkCache: {
        ...get().linkCache,
        [uid]: links
      }
    })
  }
}))

export const getLevel = (nodeId: string) => nodeId.split(SEPARATOR).length

/** Link sanatization
 *
 * Orders the links according to their level in tree
 * Guarantees parent is before child -> Condition required for correct tree
 */

type treeMap = { id: string; uid: string }[]

export const sanatizeLinks = (links: treeMap): treeMap => {
  let oldLinks = links
  const newLinks: treeMap = []
  let currentDepth = 1

  while (oldLinks.length > 0) {
    for (const l of links) {
      if (getLevel(l.id) === currentDepth) {
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
  const links = ilinks.map((i) => ({ id: i.text, uid: i.uid }))
  const sanatizedLinks = sanatizeLinks(links)
  const tree = generateTree(sanatizedLinks)

  return tree
}

export const useFlatTreeFromILinks = () => {
  return getFlatTree(useTreeFromLinks())
}

export default useDataStore

import { withoutContinuousDelimiter } from '../../Lib/helper'
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

  tagsCache: {},

  baseNodeId: '@',

  bookmarks: [],

  archive: [],

  // Load initial data in the store
  initializeDataStore: (initData) => {
    set({
      ...initData
    })
  },

  // Add a new tag to the store
  addTag: (tag) => {
    set({
      tags: [...get().tags, generateComboText(tag, get().tags.length)]
    })
  },

  // Add a new ILink to the store
  addILink: (ilink, uid, parentId, archived) => {
    const { key, isChild } = withoutContinuousDelimiter(ilink)

    if (key) {
      ilink = isChild && parentId ? `${parentId}${key}` : key
    }

    const ilinks = get().ilinks

    const linksStrings = ilinks.map((l) => l.text)
    const parents = getAllParentIds(ilink) // includes link of child

    const newLinks = parents.filter((l) => !linksStrings.includes(l)) // only create links for non existing
    console.log({ parents, linksStrings, newLinks })

    const comboTexts = newLinks.map((l, index) => {
      const newILink = generateIlink(l, ilinks.length + index)
      console.log({ newILink })

      if (uid && newILink.text === ilink) {
        console.log({ uid, newILink })

        newILink.uid = uid
      }

      return newILink
    })

    const newLink = comboTexts.find((l) => l.text === ilink)

    const userILinks = archived ? ilinks.map((val) => (val.key === ilink ? { ...val, uid } : val)) : ilinks

    set({
      ilinks: [...userILinks, ...comboTexts]
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

  updateTagCache: (tag, nodes) => {
    const tagsCache = get().tagsCache
    if (tagsCache[tag]) delete tagsCache[tag]
    tagsCache[tag] = { nodes }
    set({ tagsCache })
  },

  updateTagsCache: (tagsCache) => {
    set({ tagsCache })
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
  },

  addInArchive: (archive) => {
    const userArchive = [...get().archive, ...archive]
    set({ archive: userArchive })
  },

  removeFromArchive: (removeArchive) => {
    const userArchive = get().archive.filter((b) => !(removeArchive.map((i) => i.key).indexOf(b.key) > -1))
    set({ archive: userArchive })
  },

  unArchive: (archive) => {
    const userArchive = get().archive
    const afterUnArchive = userArchive.filter((ar) => ar.key !== archive.key)

    set({ archive: afterUnArchive })
  },

  setArchive: (archive) => {
    const userArchive = archive
    set({ archive: userArchive })
  },

  getArchive: () => get().archive
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

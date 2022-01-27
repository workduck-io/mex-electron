import create from 'zustand'
import { generateTree, getAllParentIds, SEPARATOR } from '../components/mex/Sidebar/treeUtils'
import { generateNodeUID } from '../data/Defaults/idPrefixes'
import { CachedILink, DataStoreState } from '../types/Types'
import { generateTag } from '../utils/generateComboItem'
import { Settify, typeInvert } from '../utils/helpers'
import getFlatTree from '../utils/lib/flatTree'
import { mog, withoutContinuousDelimiter } from '../utils/lib/helper'
import { removeLink } from '../utils/lib/links'

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
    const Tags = Settify([...get().tags.map((t) => t.value), tag])
    set({
      tags: Tags.map(generateTag)
    })
  },

  // Add a new ILink to the store
  addILink: (ilink, uid, parentId, archived) => {
    const { key, isChild } = withoutContinuousDelimiter(ilink)

    if (key) {
      ilink = isChild && parentId ? `${parentId}${key}` : key
    }

    const ilinks = get().ilinks

    const linksStrings = ilinks.map((l) => l.nodeId)
    const parents = getAllParentIds(ilink) // includes link of child

    const newLinks = parents.filter((l) => !linksStrings.includes(l)) // only create links for non existing

    const newILinks = newLinks.map((l) => ({
      uid: uid && l === ilink ? uid : generateNodeUID(),
      nodeId: l
    }))

    const newLink = newILinks.find((l) => l.nodeId === ilink)

    const userILinks = archived ? ilinks.map((val) => (val.nodeId === ilink ? { ...val, uid } : val)) : ilinks

    mog('Adding ILink', { ilink, uid, parentId, archived, newLink, newLinks, userILinks, parents })
    set({
      ilinks: [...userILinks, ...newILinks]
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

  /*
   * Adds InternalLink between two nodes
   * Should not add duplicate links
   */
  addInternalLink: (ilink, uid) => {
    mog('Creating links', { ilink, uid })
    // No self links will be added
    if (uid === ilink.uid) return

    let nodeLinks = get().linkCache[uid]
    let secondNodeLinks = get().linkCache[ilink.uid]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    // Add internallink if not already present
    const isInNode = nodeLinks.filter((n) => n.uid === ilink.uid && n.type === ilink.type).length > 0
    if (!isInNode) nodeLinks.push(ilink)

    // Add internallink if not already present
    const isInSecondNode = secondNodeLinks.filter((n) => n.uid === uid && n.type === typeInvert(ilink.type)).length > 0
    if (!isInSecondNode) {
      secondNodeLinks.push({
        type: typeInvert(ilink.type),
        uid: uid
      })
    }

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
    const userArchive = get().archive.filter((b) => !(removeArchive.map((i) => i.nodeId).indexOf(b.nodeId) > -1))
    set({ archive: userArchive })
  },

  unArchive: (archive) => {
    const userArchive = get().archive
    const afterUnArchive = userArchive.filter((ar) => ar.nodeId !== archive.nodeId)

    set({ archive: afterUnArchive })
  },

  setArchive: (archive) => {
    const userArchive = archive
    set({ archive: userArchive })
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
  const links = ilinks.map((i) => ({ id: i.nodeId, uid: i.uid }))
  const sanatizedLinks = sanatizeLinks(links)
  const tree = generateTree(sanatizedLinks)

  return tree
}

export const useFlatTreeFromILinks = () => {
  return getFlatTree(useTreeFromLinks())
}

export default useDataStore

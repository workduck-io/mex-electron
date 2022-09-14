import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { getAllParentIds, SEPARATOR } from '../components/mex/Sidebar/treeUtils'
import { generateNodeUID } from '../data/Defaults/idPrefixes'
import { CachedILink, DataStoreState } from '../types/Types'
import { generateTag } from '../utils/generateComboItem'
import { Settify, typeInvert } from '../utils/helpers'
import { mog, withoutContinuousDelimiter } from '../utils/lib/helper'
import { getNodeIcon } from '../utils/lib/icons'
import { removeLink } from '../utils/lib/links'
import { getUniquePath } from '../utils/lib/paths'
import { produce } from 'immer'

const useDataStore = create<DataStoreState>(
  persist(
    devtools((set, get) => ({
      // Tags
      tags: [],

      // Internal links (node ids)
      ilinks: [],

      // Slash commands
      slashCommands: { default: [], internal: [] },

      linkCache: {},

      tagsCache: {},

      baseNodeId: '@',

      bookmarks: [],

      sharedNodes: [],

      archive: [],

      namespaces: [],

      initialized: true,
      // Load initial data in the store
      initializeDataStore: (initData) => {
        // mog('Initializing Data store', { initData })
        set({
          ...initData,
          initialized: true
        })
      },

      addNamespace: (namespace) => {
        set({ namespaces: [...get().namespaces, namespace] })
      },

      setNamespaces: (namespaces) => set({ namespaces }),
      // removeNamespace: (id) => {
      //   const ns = get().namespaces
      //   delete ns[id]
      //   set({namespaces: ns})
      // },

      // Add a new tag to the store
      addTag: (tag) => {
        const Tags = Settify([...get().tags.map((t) => t.value), tag])
        set({
          tags: Tags.map(generateTag)
        })
      },

      setTags: (tags) => {
        set({ tags })
      },

      /*
   * Add a new ILink to the store
   * ## Rules
      - When new node / rename and clash
        - with existing add numeric suffix
        - not allowed with reserved keywords
   */

      addILink: ({ ilink, namespace, nodeid, openedNotePath, archived, showAlert }) => {
        const uniquePath = get().checkValidILink({ notePath: ilink, openedNotePath, namespace, showAlert })
        mog("Unique Path", { uniquePath })

        const ilinks = get().ilinks
        const linksStrings = ilinks.filter(l => l.namespace === namespace).map((l) => l.path)

        const parents = getAllParentIds(uniquePath) // includes link of child
        const newLinks = parents.filter((l) => !linksStrings.includes(l)) // only create links for non existing

        const newILinks = newLinks.map((l) => ({
          nodeid: nodeid && l === uniquePath ? nodeid : generateNodeUID(),
          namespace,
          path: l,
          icon: getNodeIcon(l)
        }))

        const newLink = newILinks.find((l) => l.path === uniquePath && l.namespace === namespace)

        const userILinks = archived ? ilinks.map((val) => (val.path === uniquePath ? { ...val, nodeid } : val)) : ilinks
        const createdILinks = [...userILinks, ...newILinks]

        set({
          ilinks: createdILinks
        })

        if (newLink) return newLink

        return
      },

      checkValidILink: ({ notePath, openedNotePath, showAlert, namespace }) => {
        const { key, isChild } = withoutContinuousDelimiter(notePath)

        // * If `notePath` starts with '.', than create note under 'opened note'.
        if (key) {
          notePath = isChild && openedNotePath ? `${openedNotePath}${key}` : key
        }

        const iLinksOfNamespace = namespace ? get().ilinks.filter(link => link.namespace === namespace) : get().ilinks
        mog("ILINKS OF NOTE ARE", { iLinksOfNamespace, notePath })


        const linksStrings = iLinksOfNamespace.map((l) => l.path)
        const reservedOrUnique = getUniquePath(notePath, linksStrings, showAlert)

        if (!reservedOrUnique) {
          throw Error(`ERROR-RESERVED: PATH (${notePath}) IS RESERVED. YOU DUMB`)
        }

        return reservedOrUnique.unique
      },

      setIlinks: (ilinks) => {
        set(
          produce(draft => {
            draft.ilinks = ilinks
          })
        )
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

      setSharedNodes: (sharedNodes) => {
        set({ sharedNodes })
      },

      getSharedNodes: () => get().sharedNodes,

      setBaseNodeId: (baseNodeId) => set({ baseNodeId }),

      /*
       * Adds InternalLink between two nodes
       * Should not add duplicate links
       */
      addInternalLink: (ilink, nodeid) => {
        // mog('Creating links', { ilink, nodeid })
        // No self links will be added
        if (nodeid === ilink.nodeid) return

        let nodeLinks = get().linkCache[nodeid]
        let secondNodeLinks = get().linkCache[ilink.nodeid]

        if (!nodeLinks) nodeLinks = []
        if (!secondNodeLinks) secondNodeLinks = []

        // Add internallink if not already present
        const isInNode = nodeLinks.filter((n) => n.nodeid === ilink.nodeid && n.type === ilink.type).length > 0
        if (!isInNode) nodeLinks.push(ilink)

        // Add internallink if not already present
        const isInSecondNode =
          secondNodeLinks.filter((n) => n.nodeid === nodeid && n.type === typeInvert(ilink.type)).length > 0
        if (!isInSecondNode) {
          secondNodeLinks.push({
            type: typeInvert(ilink.type),
            nodeid: nodeid
          })
        }

        set({
          linkCache: {
            ...get().linkCache,
            [nodeid]: nodeLinks,
            [ilink.nodeid]: secondNodeLinks
          }
        })
      },

      removeInternalLink: (ilink, nodeid) => {
        let nodeLinks = get().linkCache[nodeid]
        let secondNodeLinks = get().linkCache[ilink.nodeid]

        if (!nodeLinks) nodeLinks = []
        if (!secondNodeLinks) secondNodeLinks = []

        nodeLinks = removeLink(ilink, nodeLinks)
        const secondLinkToDelete: CachedILink = {
          type: ilink.type === 'from' ? 'to' : 'from',
          nodeid: nodeid
        }
        secondNodeLinks = removeLink(secondLinkToDelete, secondNodeLinks)

        set({
          linkCache: {
            ...get().linkCache,
            [nodeid]: nodeLinks,
            [ilink.nodeid]: secondNodeLinks
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

      updateInternalLinks: (linkCache) => set({ linkCache }),
      updateInternalLinksForNode: (links, nodeid) => {
        set({
          linkCache: {
            ...get().linkCache,
            [nodeid]: links
          }
        })
      },

      clear: () => set({ baseNodeId: 'doc' }),

      addInArchive: (archive) => {
        const userArchive = [...get().archive, ...archive]
        set({ archive: userArchive })
      },

      removeFromArchive: (removeArchive) => {
        const userArchive = get().archive.filter((b) => !(removeArchive.map((i) => i.path).indexOf(b.path) > -1))
        set({ archive: userArchive })
      },

      unArchive: (archive) => {
        const userArchive = get().archive
        const afterUnArchive = userArchive.filter((ar) => ar.path !== archive.path)

        set({ archive: afterUnArchive })
      },

      setArchive: (archive) => {
        const userArchive = archive
        set({ archive: userArchive })
      }
    })),
    { name: 'DATA_STORE_PERSIST', partialize: (store) => ({ baseNodeId: store.baseNodeId }) }
  )
)

export const getLevel = (path: string) => path.split(SEPARATOR).length

export default useDataStore

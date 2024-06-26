import { useApi } from '@apis/useSaveApi'
import { useContentStore } from '@store/useContentStore'
import { mog } from '@utils/lib/mog'

import { useAuth } from '@workduck-io/dwindle'
import { API } from '../API'

import { USE_API } from '../data/Defaults/dev_'
import { useAuthStore } from '../services/auth/useAuth'
import useDataStore from '../store/useDataStore'
import { ILink } from '../types/Types'
import { getTitleFromPath } from './useLinks'
import { useSaveData } from './useSaveData'
import { useSearch } from './useSearch'

const useArchive = () => {
  const setArchive = useDataStore((state) => state.setArchive)
  const archive = useDataStore((state) => state.archive)
  const unArchive = useDataStore((state) => state.unArchive)
  const addInArchive = useDataStore((state) => state.addInArchive)
  const removeArchive = useDataStore((state) => state.removeFromArchive)


  const setContent = useContentStore((store) => store.setContent)
  const updateTagsCache = useDataStore((state) => state.updateTagsCache)
  const updateInternalLinks = useDataStore((state) => state.updateInternalLinks)

  const { updateDocument } = useSearch()
  const { saveData } = useSaveData()
  const { userCred } = useAuth()

  const updateArchiveLinks = (addedILinks: Array<ILink>, removedILinks: Array<ILink>): Array<ILink> => {
    const archive = useDataStore.getState().archive

    // * Find the Removed Notes
    const intersection = removedILinks.filter((l) => {
      const note = addedILinks.find((rem) => l.nodeid === rem.nodeid)
      return !note
    })

    const newArchiveNotes = [...archive, ...intersection]
    setArchive(newArchiveNotes)

    mog('Archiving notes', { newArchiveNotes, intersection })

    return newArchiveNotes
  }

  const archived = (nodeid: string) => {
    return archive.find((node) => node.nodeid === nodeid)
  }

  const addArchiveData = async (nodes: ILink[], namespaceID: string): Promise<boolean> => {
    if (!USE_API) {
      addInArchive(nodes)
      return true
    }

    if (userCred) {
      return await API.node
      .archive(
        namespaceID,
        nodes.map((node) => node.nodeid)
      )
        .then((archivedNodeids) => {
          // We only get the data for archived nodeids in this response
          mog('Archived Nodes', { archivedNodeids})
          if (archivedNodeids && archivedNodeids?.length > 0) {
            const archivedNodes = nodes
              .filter((n) => archivedNodeids.includes(n.nodeid))
              .map((n) => ({ ...n, path: getTitleFromPath(n.path) }))
            addInArchive(archivedNodes)
          }
          // TODO: Once middleware is setup, use returned hierarchy to update the archived notes
          // const { archivedHierarchy } = d.data
          // mog('archivedHierarchy', { archivedHierarchy })

          // if (archivedHierarchy) {
          //   const addedArchivedLinks = hierarchyParser(archivedHierarchy, namespaceID, {
          //     withParentNodeId: true,
          //     allowDuplicates: true
          //   })

          //   if (addedArchivedLinks) {
          //     // * set the new hierarchy in the tree

          //     mog('addedArchivedLinks', { addedArchivedLinks })
          //     setArchive(addedArchivedLinks)
          //   }
          // }
        })
        .then(() => {
          return true
        })
        .catch((e) => {
          console.log(e)
          return false
        })
    }
    return false
  }

  const unArchiveData = async (nodes: ILink[]) => {
    if (!USE_API) {
      return unArchive(nodes[0])
    }
    await API.node
      .unarchive(nodes.map((node) => node.nodeid))
      .then((d) => {
        mog('Unarchive Data', d)
        if (d) unArchive(nodes[0])
        return d
      })
      .catch(console.error)
  }

  // TODO: figure how namespaces are working with archive hierarchy
  const getArchiveNotesHierarchy = async () => {
    if (!USE_API) {
      return archive
    }

    await API.node
    .allArchived()
    .then((hierarchy) => {
      if (hierarchy) {

          mog('getArchiveNotesHierarchy', { hierarchy })

          // const archivedNotes = hierarchyParser(hierarchy, { withParentNodeId: true, allowDuplicates: true })

          // if (archivedNotes && archivedNotes.length > 0) {
          //   const localILinks = useDataStore.getState().archive
          //   const { toUpdateLocal } = iLinksToUpdate(localILinks, archivedNotes)

          //   runBatch(
          //     toUpdateLocal.map((ilink) =>
          //       getDataAPI(ilink.nodeid, false, false, false).then((data) => {
          //         setContent(ilink.nodeid, data.content, data.metadata)
          //         updateDocument('archive', ilink.nodeid, data.content)
          //       })
          //     )
          //   )
          // }

          // setArchive(archivedNotes)
        }
        return hierarchy
      })
      .catch(mog)
  }

  const cleanCachesAfterDelete = (nodes: ILink[]) => {
    const linkCache = useDataStore.getState().linkCache
    const tagsCache = useDataStore.getState().tagsCache
    const removedPaths = nodes.map((n) => n.nodeid)
    const cleanTagCache = Object.entries(tagsCache).reduce((p, [k, v]) => {
      return { ...p, [k]: { nodes: v.nodes.filter((n) => !removedPaths.includes(n)) } }
    }, {})
    const cleanLinkCache = Object.entries(linkCache).reduce((p, [k, v]) => {
      if (removedPaths.includes(k)) return p
      return { ...p, [k]: v.filter((n) => !removedPaths.includes(n.nodeid)) }
    }, {})
    mog('Cleaning Caches', { nodes, linkCache, tagsCache, removedPaths, cleanTagCache, cleanLinkCache })
    updateTagsCache(cleanTagCache)
    updateInternalLinks(cleanLinkCache)
  }

  const removeArchiveData = async (nodeids: ILink[]): Promise<boolean> => {
    if (!USE_API) {
      removeArchive(nodeids)
      return true
    }

    if (userCred) {
      const res = await API.node
        .deleteArchived(nodeids.map((i) => i.nodeid))
        .then(() => {
          removeArchive(nodeids)
        })
        .then(() => {
          cleanCachesAfterDelete(nodeids)
        })
        .then(() => saveData())
        .then(() => {
          return true
        })
        .catch((e) => {
          console.log(e)
          return false
        })
      return res
    }
    return false
  }

  return { archived, addArchiveData, updateArchiveLinks, removeArchiveData, getArchiveNotesHierarchy, unArchiveData }
}

export default useArchive

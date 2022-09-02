import { WORKSPACE_HEADER } from './../data/Defaults/defaults'
import { client, useAuth } from '@workduck-io/dwindle'
import { apiURLs } from '../apis/routes'
import { USE_API } from '../data/Defaults/dev_'
import { useAuthStore } from '../services/auth/useAuth'
import useDataStore from '../store/useDataStore'
import { ILink } from '../types/types'
import { mog } from '../utils/lib/helper'
import { useSaveData } from './useSaveData'
import { hierarchyParser } from './useHierarchy'
import { iLinksToUpdate } from '@utils/hierarchy'
import { runBatch } from '@utils/lib/batchPromise'
import { useApi } from '@apis/useSaveApi'
import { useContentStore } from '@store/useContentStore'
import { useSearch } from './useSearch'

const useArchive = () => {
  const setArchive = useDataStore((state) => state.setArchive)
  const archive = useDataStore((state) => state.archive)
  const unArchive = useDataStore((state) => state.unArchive)
  const addInArchive = useDataStore((state) => state.addInArchive)
  const removeArchive = useDataStore((state) => state.removeFromArchive)
  const { getDataAPI } = useApi()

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

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

  const addArchiveData = async (nodes: ILink[]): Promise<boolean> => {
    if (!USE_API) {
      addInArchive(nodes)
      return true
    }

    if (userCred) {
      return await client
        .put(
          apiURLs.archiveNodes(),
          {
            ids: nodes.map((i) => i.nodeid)
          },
          {
            headers: {
              [WORKSPACE_HEADER]: getWorkspaceId(),
              Accept: 'application/json, text/plain, */*'
            }
          }
        )
        .then((d) => {
          const { archivedHierarchy } = d.data

          if (archivedHierarchy) {
            const addedArchivedLinks = hierarchyParser(archivedHierarchy, {
              withParentNodeId: true,
              allowDuplicates: true
            })

            if (addedArchivedLinks) {
              // * set the new hierarchy in the tree
              setArchive(addedArchivedLinks)
            }
          }
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
    await client
      .put(
        apiURLs.unArchiveNodes(),
        {
          ids: nodes.map((i) => i.nodeid)
        },
        {
          headers: {
            [WORKSPACE_HEADER]: getWorkspaceId(),
            Accept: 'application/json, text/plain, */*'
          }
        }
      )
      .then((d) => {
        mog('Unarchive Data', d.data)
        if (d.data) unArchive(nodes[0])
        return d.data
      })
      .catch(console.error)
  }

  const getArchiveNotesHierarchy = async () => {
    if (!USE_API) {
      return archive
    }

    await client
      .get(apiURLs.getArchiveNotesHierarchy(), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        if (d.data) {
          const hierarchy = d.data

          const archivedNotes = hierarchyParser(hierarchy, { withParentNodeId: true, allowDuplicates: true })

          if (archivedNotes && archivedNotes.length > 0) {
            const localILinks = useDataStore.getState().archive
            const { toUpdateLocal } = iLinksToUpdate(localILinks, archivedNotes)

            runBatch(
              toUpdateLocal.map((ilink) =>
                getDataAPI(ilink.nodeid, false, false, false).then((data) => {
                  setContent(ilink.nodeid, data.content, data.metadata)
                  updateDocument('archive', ilink.nodeid, data.content)
                })
              )
            )
          }

          setArchive(archivedNotes)
        }
        return d.data
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
      const res = await client
        .post(
          apiURLs.deleteArchiveNodes(),
          {
            ids: nodeids.map((i) => i.nodeid)
          },
          {
            headers: {
              [WORKSPACE_HEADER]: getWorkspaceId(),
              Accept: 'application/json, text/plain, */*'
            }
          }
        )
        // .then(console.log)
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

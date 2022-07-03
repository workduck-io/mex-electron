import { client } from '@workduck-io/dwindle'
import { defaultContent } from '../data/Defaults/baseData'
import { USE_API } from '../data/Defaults/dev_'
import '../services/apiClient/apiClient'
import { useAuthStore } from '../services/auth/useAuth'
import { isRequestedWithin } from '../store/useApiStore'
import { useContentStore } from '../store/useContentStore'
import { mog } from '../utils/lib/helper'
import { extractMetadata } from '../utils/lib/metadata'
import { deserializeContent, serializeContent } from '../utils/lib/serialize'
import { apiURLs } from './routes'
import { WORKSPACE_HEADER, DEFAULT_NAMESPACE } from '../data/Defaults/defaults'
import { useLinks } from '../hooks/useLinks'
import { useNodes } from '@hooks/useNodes'
import { ILink, NodeEditorContent } from '../types/Types'
import { hierarchyParser } from '@hooks/useHierarchy'
import { getTagsFromContent } from '@utils/lib/content'
import { ipcRenderer } from 'electron'
import { IpcAction } from '@data/IpcAction'
import useDataStore from '@store/useDataStore'
import { iLinksToUpdate } from '@utils/hierarchy'
import { runBatch } from '@utils/lib/batchPromise'
import { useUpdater } from '@hooks/useUpdater'

export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getTitleFromNoteId, updateILinks } = useLinks()
  const { getSharedNode } = useNodes()
  const setILinks = useDataStore((store) => store.setIlinks)

  const { updateFromContent } = useUpdater()

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */

  const saveNewNodeAPI = async (
    noteId: string,
    options?: {
      path: string
      parentNoteId: string
      content: NodeEditorContent
    }
  ) => {
    const reqData = {
      id: noteId,
      title: getTitleFromNoteId(noteId),
      referenceID: options?.parentNoteId,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      type: 'NodeRequest',
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content, noteId)
    }

    setContent(noteId, options.content)

    if (!USE_API) {
      return
    }

    const data = await client
      .post(apiURLs.saveNode, reqData, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        const { addedPaths, removedPaths, node } = d.data
        const addedILinks = hierarchyParser(addedPaths)
        const removedILinks = hierarchyParser(removedPaths)
        setMetadata(noteId, extractMetadata(node))

        // * set the new hierarchy in the tree
        updateILinks(addedILinks, removedILinks)

        setMetadata(noteId, extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })

    return data
  }

  const bulkSaveNodes = async (
    noteId: string,
    options: {
      path: string
      content: NodeEditorContent
    }
  ) => {
    const reqData = {
      nodePath: {
        path: options.path
      },
      title: getTitleFromNoteId(noteId),
      namespaceIdentifier: DEFAULT_NAMESPACE,
      type: 'NodeBulkRequest',
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content, noteId)
    }

    setContent(noteId, options.content)

    const data = await client
      .post(apiURLs.bulkSaveNodes, reqData, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId()
        }
      })
      .then((d: any) => {
        const { addedPaths, removedPaths, node } = d.data
        const addedILinks = hierarchyParser(addedPaths)
        const removedILinks = hierarchyParser(removedPaths)
        setMetadata(noteId, extractMetadata(node))

        // * set the new hierarchy in the tree
        updateILinks(addedILinks, removedILinks)

        return d.data
      })

    return data
  }

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (nodeid: string, content: any[], isShared = false, title?: string) => {
    const reqData = {
      id: nodeid,
      type: 'NodeRequest',
      title: title || getTitleFromNoteId(nodeid),
      namespaceIdentifier: DEFAULT_NAMESPACE,
      tags: getTagsFromContent(content),
      data: serializeContent(content ?? defaultContent.content, nodeid)
    }

    // if (!isShared) {
    //   reqData['lastEditedBy'] = useAuthStore.getState().userDetails.email
    // }

    if (isShared) {
      const node = getSharedNode(nodeid)
      if (node.currentUserAccess[nodeid] === 'READ') return
    }

    if (!USE_API) {
      return
    }
    const url = isShared ? apiURLs.updateSharedNode : apiURLs.saveNode
    const data = await client
      .post(url, reqData, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        mog('savedData', { d })
        setMetadata(nodeid, extractMetadata(d.data))
        // setContent(nodeid, deserializeContent(d.data.data), extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const makeNotePublic = async (nodeId: string) => {
    const URL = apiURLs.makeNotePublic(nodeId)
    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: {
          'mex-workspace-id': getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((resp) => resp.data)
      .then((data: any) => {
        setMetadata(nodeId, { publicAccess: true })
        return nodeId
      })
      .catch((error) => {
        mog('MakeNodePublicError', { error })
      })
  }

  const makeNotePrivate = async (nodeId: string) => {
    const URL = apiURLs.makeNotePrivate(nodeId)

    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: {
          'mex-workspace-id': getWorkspaceId()
        }
      })
      .then((resp) => resp.data)
      .then((data: any) => {
        setMetadata(nodeId, { publicAccess: false })
        return nodeId
      })
      .catch((error) => {
        mog('MakeNodePrivateError', { error })
      })
  }

  const refactorNotes = async (
    existingNodePath: { path: string; namespaceId?: string },
    newNodePath: { path: string; namespaceId?: string },
    nodeId: string
  ) => {
    const reqData = {
      existingNodePath,
      newNodePath,
      nodeID: nodeId,
      type: 'RefactorRequest'
    }

    const data = await client
      .post(apiURLs.refactor, reqData, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((response) => {
        mog('refactor', response.data)
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })

    return data
  }

  const getPublicNoteApi = async (noteId: string) => {
    const res = await client
      .get(apiURLs.getPublicNote(noteId), {
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d: any) => {
        // console.log(metadata, d.data)
        return {
          title: d.data.title,
          data: d.data.data,
          metadata: extractMetadata(d.data),
          version: d.data.version ?? undefined
        }
      })

    if (res) {
      return {
        id: noteId,
        title: res.title ?? '',
        content: deserializeContent(res.data),
        metadata: res.metadata ?? undefined,
        version: res.version
      }
    }
  }

  const getPublicURL = (nodeid: string) => {
    const meta = useContentStore.getState().getAllMetadata()
    mog('META', { m: meta?.[nodeid] })
    if (meta?.[nodeid]?.publicAccess) return apiURLs.getNotePublicURL(nodeid)
  }

  const getDataAPI = async (nodeid: string, isShared = false, isRefresh = false) => {
    const url = isShared ? apiURLs.getSharedNode(nodeid) : apiURLs.getNode(nodeid)
    if (!isShared && isRequestedWithin(2, url) && !isRefresh) {
      console.warn('\nAPI has been requested before, cancelling\n')
      return
    }

    // console.warn('\n\n\n\nAPI has not been requested before, requesting\n\n\n\n')
    const res = await client
      .get(url, {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        // console.log(metadata, d.data)
        const content = deserializeContent(d.data.data)
        updateFromContent(nodeid, content)

        return { data: d.data.data, metadata: extractMetadata(d.data), version: d.data.version ?? undefined }
      })
      .catch((e) => {
        console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
      })

    if (res) {
      return { content: deserializeContent(res.data), metadata: res.metadata ?? undefined, version: res.version }
    }
  }

  const getNodesByWorkspace = async (): Promise<ILink[]> => {
    const data = await client
      .get(apiURLs.getHierarchy(), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        if (d.data) {
          const nodes = hierarchyParser(d.data)
          if (nodes && nodes.length > 0) {
            const localILinks = useDataStore.getState().ilinks
            const { toUpdateLocal } = iLinksToUpdate(localILinks, nodes)

            runBatch(toUpdateLocal.map((ilink) => getDataAPI(ilink.nodeid)))

            ipcRenderer.send(IpcAction.UPDATE_ILINKS, { ilinks: nodes })
          }

          setILinks(nodes)

          return nodes
        }
      })

    return data
  }

  const getGoogleAuthUrl = async () => {
    return await client
      .get<any>(apiURLs.getGoogleAuthUrl(), {})
      .then((resp) => resp.data)
      .catch((error) => console.error(error))
  }

  return {
    saveDataAPI,
    getDataAPI,
    refactorNotes,
    makeNotePrivate,
    makeNotePublic,
    getPublicNoteApi,
    getPublicURL,
    bulkSaveNodes,
    saveNewNodeAPI,
    getNodesByWorkspace,
    getGoogleAuthUrl
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testPerfFunc = (func: () => any, num = 100) => {
  const ar = Array.from(Array(num).keys())
  const t0 = performance.now()
  const res = ar.map(() => func())
  const t1 = performance.now()
  console.log('Performance: ', {
    time: t1 - t0,
    t1,
    t0,
    avg: (t1 - t0) / ar.length,
    res: { res }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const testPerf = async (nodeid: string) => {
//   const ar = Array.from(Array(100).keys())
//   const t0 = performance.now()
//   let lost = 0
//   await Promise.all(
//     ar.map(async () => {
//       await API.get('mex', `/node/${nodeid}`, {}).catch(() => {
//         lost++
//       })
//     })
//   )
//   const t1 = performance.now()
//   console.info('Parallel Performance', {
//     time: t1 - t0,
//     t1,
//     t0,
//     lost,
//     avg: (t1 - t0) / ar.length
//   })

//   const t01 = performance.now()
//   lost = 0
//   await ar
//     .reduce(async (seq) => {
//       return seq
//         .then(async () => {
//           await API.get('mex', `/node/${nodeid}`, {})
//         })
//         .catch(() => {
//           lost++
//         })
//     }, Promise.resolve())
//     .then(() => console.info('Finished'))

//   const t11 = performance.now()
//   console.info('Linear Performance', {
//     time: t11 - t01,
//     t11,
//     t01,
//     lost,
//     avg: (t11 - t01) / (ar.length - lost)
//   })
// }

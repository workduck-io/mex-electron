import { client } from '@workduck-io/dwindle'
import { defaultContent } from '../data/Defaults/baseData'
import { USE_API } from '../data/Defaults/dev_'
import '../services/apiClient/apiClient'
import { useAuthStore } from '../services/auth/useAuth'
import { isRequestedWithin } from '../store/useApiStore'
import { useContentStore } from '../store/useContentStore'
import { mog, removeNulls } from '../utils/lib/helper'
import { extractMetadata } from '../utils/lib/metadata'
import { deserializeContent, serializeContent } from '../utils/lib/serialize'
import { apiURLs } from './routes'
import { WORKSPACE_HEADER, DEFAULT_NAMESPACE } from '../data/Defaults/defaults'
import { useLinks } from '../hooks/useLinks'
import { useNodes } from '@hooks/useNodes'
import { NodeEditorContent } from '../types/Types'
import { hierarchyParser } from '@hooks/useHierarchy'

export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getNodeTitleSave, getTitleFromPath, updateILinks } = useLinks()
  const { getSharedNode } = useNodes()
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
      title: getTitleFromPath(options.path),
      referenceID: options?.parentNoteId,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      type: 'NodeRequest',
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
      id: noteId,
      title: getTitleFromPath(options.path, true),
      namespaceIdentifier: DEFAULT_NAMESPACE,
      type: 'NodeBulkRequest',
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
  const saveDataAPI = async (nodeid: string, content: any[], isShared = false) => {
    const reqData = {
      id: nodeid,
      type: 'NodeRequest',
      title: getNodeTitleSave(nodeid),
      namespaceIdentifier: DEFAULT_NAMESPACE,
      data: serializeContent(content ?? defaultContent.content, nodeid)
    }
    if (!isShared) {
      reqData['lastEditedBy'] = useAuthStore.getState().userDetails.email
    }

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
        const metadata = {
          createdBy: d.data.createdBy,
          createdAt: d.data.createdAt,
          lastEditedBy: d.data.lastEditedBy,
          updatedAt: d.data.updatedAt
        }

        // console.log(metadata, d.data)
        return { data: d.data.data, metadata: removeNulls(metadata), version: d.data.version ?? undefined }
      })
      .catch((e) => {
        console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
      })

    if (res) {
      return { content: deserializeContent(res.data), metadata: res.metadata ?? undefined, version: res.version }
    }
  }

  const getNodesByWorkspace = async () => {
    const data = await client
      .get(apiURLs.getHeirarchy(), {
        headers: {
          [WORKSPACE_HEADER]: getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d) => {
        return d.data
      })

    return data
  }

  const getGoogleAuthUrl = async () => {
    return await client
      .get<any>(apiURLs.getGoogleAuthUrl(), {})
      .then((resp) => resp.data)
      .catch((error) => console.error(error))
  }

  return { saveDataAPI, getDataAPI, bulkSaveNodes, saveNewNodeAPI, getNodesByWorkspace, getGoogleAuthUrl }
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

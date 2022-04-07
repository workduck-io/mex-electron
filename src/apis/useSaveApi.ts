import { client } from '@workduck-io/dwindle'
import { defaultContent, getRandomQAContent } from '../data/Defaults/baseData'
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

// clientInterceptor
//
export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */

  const defaultQAContent = getRandomQAContent()

  const saveNewNodeAPI = async (nodeid: string) => {
    const reqData = {
      id: nodeid,
      type: 'NodeRequest',
      lastEditedBy: useAuthStore.getState().userDetails.email,
      namespaceIdentifier: 'NAMESPACE1',
      data: serializeContent(defaultQAContent)
    }

    setContent(nodeid, defaultQAContent)

    if (!USE_API()) {
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
        mog('saveNewNodeAPI response', d)
        setMetadata(nodeid, extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }
  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (nodeid: string, content: any[]) => {
    const reqData = {
      id: nodeid,
      type: 'NodeRequest',
      lastEditedBy: useAuthStore.getState().userDetails.email,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      data: serializeContent(content ?? defaultContent.content)
    }

    if (!USE_API()) {
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
        mog('savedData', { d })
        // setMetadata(nodeid, extractMetadata(d.data))
        setContent(nodeid, deserializeContent(d.data.data), extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const getDataAPI = async (nodeid: string) => {
    const url = apiURLs.getNode(nodeid)
    if (isRequestedWithin(5, url)) {
      console.warn('\nAPI has been requested before, cancelling\n')
      return
    }

    // console.warn('\n\n\n\nAPI has not been requested before, requesting\n\n\n\n')
    const res = await client
      .get(apiURLs.getNode(nodeid), {
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
      .catch(console.error)

    if (res) {
      return { content: deserializeContent(res.data), metadata: res.metadata ?? undefined, version: res.version }
    }
  }

  const getNodesByWorkspace = async (workspaceId: string) => {
    const data = await client
      .get(apiURLs.getNodesByWorkspace(workspaceId), {
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

  return { saveDataAPI, getDataAPI, saveNewNodeAPI, getNodesByWorkspace, getGoogleAuthUrl }
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

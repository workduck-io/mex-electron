import { defaultContent } from '../data/Defaults/baseData'
import { USE_API } from '../data/Defaults/dev_'
import { deserializeContent, serializeContent } from '../utils/Lib/serialize'
import { client } from '@workduck-io/dwindle'
import { apiURLs } from './routes'
import { removeNulls } from '../utils/Lib/helper'
import { useAuthStore } from '../services/auth/useAuth'
import { useContentStore } from '../store/useContentStore'
import { extractMetadata } from '../utils/Lib/metadata'

export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (uid: string, content: any[]) => {
    const reqData = {
      id: uid,
      type: 'NodeRequest',
      lastEditedBy: useAuthStore.getState().userDetails.email,
      namespaceIdentifier: 'NAMESPACE1',
      workspaceIdentifier: getWorkspaceId(),
      data: serializeContent(content ?? defaultContent.content)
    }

    if (!USE_API()) {
      return
    }
    const data = await client
      .post(apiURLs.saveNode, reqData, {})
      .then((d) => {
        console.log('savedData', d)
        setMetadata(uid, extractMetadata(d.data))
        setContent(uid, deserializeContent(d.data.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const getDataAPI = async (uid: string) => {
    const res = await client
      .get(apiURLs.getNode(uid), {})
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
      return { data: deserializeContent(res.data), metadata: res.metadata ?? undefined, version: res.version }
    }
  }

  const getNodesByWorkspace = async (workspaceId: string) => {
    const data = await client.get(apiURLs.getNodesByWorkspace(workspaceId), {}).then((d) => {
      return d.data
    })

    return data
  }

  return { saveDataAPI, getDataAPI, getNodesByWorkspace }
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
// const testPerf = async (uid: string) => {
//   const ar = Array.from(Array(100).keys())
//   const t0 = performance.now()
//   let lost = 0
//   await Promise.all(
//     ar.map(async () => {
//       await API.get('mex', `/node/${uid}`, {}).catch(() => {
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
//           await API.get('mex', `/node/${uid}`, {})
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

import { RestAPI as API } from '@aws-amplify/api-rest'
import { defaultContent } from '../Defaults/baseData'
import { USE_API } from '../Defaults/dev_'
import { deserializeContent, serializeContent } from '../Lib/serialize'
import initializeAmplify from './amplify/init'
import { client } from '@workduck-io/dwindle'
import { apiURLs } from './routes'
import { removeNulls } from '../Lib/helper'
import { useAuthStore } from '../Hooks/useAuth/useAuth'
import { useContentStore } from '../Editor/Store/ContentStore'

initializeAmplify()

export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setMetadata = useContentStore((store) => store.setMetadata)

  const saveDataAPI = (uid: string, content: any[]) => {
    const reqData = {
      id: uid,
      lastEditedBy: useAuthStore.getState().userDetails.email,
      namespaceIdentifier: 'NAMESPACE1',
      workspaceIdentifier: getWorkspaceId(),
      data: serializeContent(content ?? defaultContent)
    }

    if (!USE_API) {
      return
    }
    client
      .post(apiURLs.saveNode, reqData, {})
      .then((d) => {
        // console.log('savedData', d)
        const metadata: any = {
          lastEditedBy: d.data.lastEditedBy,
          updatedAt: d.data.updatedAt
        }
        if (d.data.createBy !== null) {
          metadata.createBy = d.data.createBy
        }
        if (d.data.createdAt !== null) {
          metadata.createdAt = d.data.createdAt
        }
        setMetadata(uid, removeNulls(metadata))
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const getDataAPI = async (uid: string) => {
    const res = await client
      .get(apiURLs.getNode(uid), {})
      .then((d) => {
        const metadata = {
          createBy: d.data.createBy,
          createdAt: d.data.createdAt,
          lastEditedBy: d.data.lastEditedBy,
          updatedAt: d.data.updatedAt
        }
        return { data: d.data.data, metadata: removeNulls(metadata) }
      })
      .catch(console.error)

    if (res) {
      return { data: deserializeContent(res.data), metadata: res.metadata ? res.metadata : undefined }
    }
  }

  return { saveDataAPI, getDataAPI }
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
const testPerf = async (uid: string) => {
  const ar = Array.from(Array(100).keys())
  const t0 = performance.now()
  let lost = 0
  await Promise.all(
    ar.map(async () => {
      await API.get('mex', `/node/${uid}`, {}).catch(() => {
        lost++
      })
    })
  )
  const t1 = performance.now()
  console.info('Parallel Performance', {
    time: t1 - t0,
    t1,
    t0,
    lost,
    avg: (t1 - t0) / ar.length
  })

  const t01 = performance.now()
  lost = 0
  await ar
    .reduce(async (seq) => {
      return seq
        .then(async () => {
          await API.get('mex', `/node/${uid}`, {})
        })
        .catch(() => {
          lost++
        })
    }, Promise.resolve())
    .then(() => console.info('Finished'))

  const t11 = performance.now()
  console.info('Linear Performance', {
    time: t11 - t01,
    t11,
    t01,
    lost,
    avg: (t11 - t01) / (ar.length - lost)
  })
}

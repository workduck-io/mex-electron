import { RestAPI as API } from '@aws-amplify/api-rest'
import { WORKSPACE_ID } from '../Defaults/auth'
import { defaultContent } from '../Defaults/baseData'
import { USE_API } from '../Defaults/dev_'
import { deserializeContent, serializeContent } from '../Lib/serialize'
import initializeAmplify from './amplify/init'
import { client } from '@workduck-io/dwindle'
import { apiURLs } from './routes'

initializeAmplify()

export const useApi = () => {
  const saveDataAPI = (uid: string, content: any[]) => {
    if (!USE_API) return
    const reqData = {
      id: uid,
      namespaceIdentifier: 'NAMESPACE1',
      workspaceIdentifier: WORKSPACE_ID,
      data: serializeContent(content ?? defaultContent)
    }

    client
      .post(apiURLs.saveNode, reqData)
      .then(() => {
        console.log('Post data', { content, data: reqData.data })
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const getDataAPI = async (uid: string) => {
    const data = await client.get(apiURLs.getNode(uid), {}).then((d) => {
      // console.log({ d })
      return d.data
    })

    const dd = deserializeContent(data)

    console.log('API DATA', { uid, data, dd })
    // testPerf(uid)

    return dd
  }

  return { saveDataAPI, getDataAPI }
}

const testPerf = async (uid: string) => {
  const ar = Array.from(Array(100).keys())
  const t0 = performance.now()
  let lost = 0
  await Promise.all(
    ar.map(async (e) => {
      const data = await API.get('mex', `/node/${uid}`, {}).catch(() => {
        lost++
      })
    })
  )
  const t1 = performance.now()
  console.log('Parallel Performance', {
    time: t1 - t0,
    t1,
    t0,
    lost,
    avg: (t1 - t0) / ar.length
  })

  const t01 = performance.now()
  lost = 0
  await ar
    .reduce((seq, n) => {
      return seq
        .then(async () => {
          await API.get('mex', `/node/${uid}`, {})
        })
        .catch((e) => {
          lost++
        })
    }, Promise.resolve())
    .then(() => console.log('Finished'))

  const t11 = performance.now()
  console.log('Linear Performance', {
    time: t11 - t01,
    t11,
    t01,
    lost,
    avg: (t11 - t01) / (ar.length - lost)
  })
}
